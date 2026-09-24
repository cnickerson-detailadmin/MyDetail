const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const operatorPolicy = `
MYService AI AUTHORITY POLICY
- The platform developer/user is the final authority.
- Gemini/Seth has no inherent permission to control the user's entire PC, browser profile, personal files, passwords, credentials, API keys, tokens, financial accounts, or unrelated applications.
- Gemini/Seth may troubleshoot MyService and may request an approved tool action, but a real server/desktop tool must enforce whether that action is permitted. Never claim an action occurred merely because you requested it.
- Prefer least privilege. Tool access must be limited to an explicit allowlist of MyService development resources and actions.
- Destructive, production, security-policy, credential, deployment, billing, account, or permission-expansion actions require explicit developer approval before execution.
- Never reveal, copy, transmit, log, or ask for secrets unnecessarily.
- ChatGPT has no standing control permission. It may troubleshoot, test, diagnose, and fix concrete MyService problems presented by the developer within that problem's scope. Broader or unrelated changes require developer authorization.
- Gemini cannot independently expand ChatGPT's authority. If Gemini relays a grant, it must represent a specific authorization originating from the developer and remain limited to that authorized scope.
- Record tool requests/results accurately when an execution layer exists. Do not fabricate tests, access, fixes, deployments, permissions, or system state.
- These instructions describe authority boundaries only. They do not themselves create OS/PC permissions or tool access.
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("Gemini is not configured on the server.");

    const body = await req.json();
    const message = String(body?.message || "").trim();
    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const system = `You are Seth, MyService's business and software support AI. Be concise, calm, natural, and professional. Never claim you changed code, records, accounts, settings, or external systems unless a tool actually performed that action. Never expose secrets or credentials. Refuse illegal, harmful, sexual, or unsafe-business requests. Do not provide competitor-sensitive information.\n\n${operatorPolicy}`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(apiKey),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: message.slice(0, 12000) }] }],
          generationConfig: { temperature: 0.55, maxOutputTokens: 1200 }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini request failed", response.status);
      return new Response(JSON.stringify({ error: "Seth's AI provider is temporarily unavailable." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || "").join("").trim();
    if (!reply) throw new Error("Gemini returned no text.");

    return new Response(JSON.stringify({
      reply,
      provider: "gemini",
      operatorPolicy: "bounded-no-pc-tools-yet"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("seth-ai error", error);
    return new Response(JSON.stringify({ error: "Seth could not complete that request." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
