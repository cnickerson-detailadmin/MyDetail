const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function stateCode(value) {
  const state = cleanText(value, 80);
  if (/^[A-Za-z]{2}$/.test(state)) return state.toUpperCase();
  const codes = {
    "Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA",
    "Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL","Georgia":"GA",
    "Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS",
    "Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA",
    "Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT",
    "Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM",
    "New York":"NY","North Carolina":"NC","North Dakota":"ND","Ohio":"OH","Oklahoma":"OK",
    "Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC",
    "South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT",
    "Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY",
    "District of Columbia":"DC",
  };
  return Object.entries(codes).find(([name]) => name === state)?.[1] || state;
}

function photonLocation(feature) {
  const properties = feature?.properties || {};
  const longitude = Number(feature?.geometry?.coordinates?.[0]);
  const latitude = Number(feature?.geometry?.coordinates?.[1]);
  const street = cleanText(
    [properties.housenumber, properties.street].filter(Boolean).join(" ") || properties.name,
    300,
  );
  const city = cleanText(
    properties.city || properties.town || properties.village || properties.locality || properties.district,
    150,
  );
  const state = stateCode(properties.statecode || properties.state);
  const postalCode = cleanText(properties.postcode, 20);
  const country = cleanText(properties.countrycode || "US", 3).toUpperCase();
  const fullAddress = cleanText(
    [street, city, state, postalCode].filter(Boolean).join(", "),
    500,
  );

  if (!fullAddress || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { fullAddress, street, city, state, postalCode, country, latitude, longitude, accuracy: "open-data" };
}

async function photonSuggestions(query) {
  const url = new URL("https://photon.komoot.io/api");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "6");
  url.searchParams.set("lang", "en");
  url.searchParams.set("countrycode", "US");
  url.searchParams.append("layer", "house");

  const response = await fetch(url, { headers: { "Accept": "application/json" } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("Address search is temporarily unavailable.");

  return (Array.isArray(data.features) ? data.features : [])
    .map((feature, index) => {
      const location = photonLocation(feature);
      return location ? {
        id: `photon-${index}-${location.latitude}-${location.longitude}`,
        name: location.street,
        fullAddress: location.fullAddress,
        location,
      } : null;
    })
    .filter(Boolean);
}

async function mapboxRequest(path, params, accessToken) {
  const url = new URL(`https://api.mapbox.com/search/searchbox/v1/${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || "Address provider request failed.");
  }
  return data;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const accessToken = Deno.env.get("MAPBOX_ACCESS_TOKEN");
    const body = await request.json().catch(() => ({}));
    const action = cleanText(body.action, 20);
    const sessionToken = cleanText(body.sessionToken, 100);
    if (!sessionToken) {
      return jsonResponse({ error: "Address-search session is missing." }, 400);
    }

    if (action === "suggest") {
      const query = cleanText(body.query, 256);
      if (query.length < 4) {
        return jsonResponse({ suggestions: [] });
      }

      if (!accessToken) {
        return jsonResponse({
          provider: "openstreetmap",
          suggestions: await photonSuggestions(query),
        });
      }

      const data = await mapboxRequest("suggest", {
        q: query,
        session_token: sessionToken,
        country: "US",
        types: "address",
        language: "en",
        limit: "6",
        proximity: "ip",
      }, accessToken);

      const suggestions = Array.isArray(data.suggestions)
        ? data.suggestions.map((item) => ({
            id: cleanText(item.mapbox_id, 500),
            name: cleanText(item.name, 300),
            fullAddress: cleanText(
              item.full_address || [item.address, item.place_formatted].filter(Boolean).join(", "),
              500,
            ),
          })).filter((item) => item.id && item.fullAddress)
        : [];

      return jsonResponse({ suggestions });
    }

    if (action === "retrieve") {
      const mapboxId = cleanText(body.mapboxId, 500);
      if (!mapboxId) {
        return jsonResponse({ error: "Select an address suggestion first." }, 400);
      }

      const data = await mapboxRequest(`retrieve/${encodeURIComponent(mapboxId)}`, {
        session_token: sessionToken,
        language: "en",
      }, accessToken);
      const feature = Array.isArray(data.features) ? data.features[0] : null;
      const properties = feature?.properties || {};
      const context = properties.context || {};
      const coordinates = properties.coordinates || {};
      const longitude = Number(coordinates.longitude ?? feature?.geometry?.coordinates?.[0]);
      const latitude = Number(coordinates.latitude ?? feature?.geometry?.coordinates?.[1]);

      if (!feature || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return jsonResponse({ error: "The selected address could not be located." }, 422);
      }

      const street = cleanText(
        context.address?.name || properties.address || properties.name,
        300,
      );
      const city = cleanText(context.place?.name || context.locality?.name, 150);
      const state = cleanText(context.region?.region_code || context.region?.name, 80)
        .replace(/^US-/, "");
      const postalCode = cleanText(context.postcode?.name, 20);
      const fullAddress = cleanText(
        properties.full_address || [street, city, state, postalCode].filter(Boolean).join(", "),
        500,
      );

      return jsonResponse({
        location: {
          fullAddress,
          street,
          city,
          state,
          postalCode,
          country: cleanText(context.country?.country_code || "US", 3).toUpperCase(),
          latitude,
          longitude,
          accuracy: cleanText(coordinates.accuracy, 40),
        },
      });
    }

    return jsonResponse({ error: "Unknown address-search action." }, 400);
  } catch (error) {
    return jsonResponse({
      error: error instanceof Error ? error.message : "Address search failed.",
    }, 500);
  }
});
