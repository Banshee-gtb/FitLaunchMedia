import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("ONSPACE_AI_API_KEY");
  const baseUrl = Deno.env.get("ONSPACE_AI_BASE_URL");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { messages, stream } = await req.json();

  // Load live published content for context
  const [
    { data: services },
    { data: industries },
    { data: projects },
    { data: faqs },
    { data: testimonials },
    { data: settings },
  ] = await Promise.all([
    supabaseAdmin.from("services").select("title,short_description,features,status").in("status", ["PUBLISHED", "APPROVED"]),
    supabaseAdmin.from("industries").select("title,description,status").in("status", ["PUBLISHED", "APPROVED"]),
    supabaseAdmin.from("projects").select("title,industry,summary,status").neq("status", "DRAFT"),
    supabaseAdmin.from("faqs").select("question,answer,category,status").eq("status", "PUBLISHED").order("sort_order"),
    supabaseAdmin.from("testimonials").select("name,organisation,industry,text,status").in("status", ["PUBLISHED", "DEMO"]).limit(8),
    supabaseAdmin.from("site_settings").select("*").eq("id", "00000000-0000-0000-0000-000000000001").single(),
  ]);

  const contextBlock = `
You are the FitLaunch Media AI assistant — a website-aware, sport-focused assistant for FitLaunch Media, a premium technology agency building websites and digital experiences for gyms, fitness businesses and sports organisations.

IMPORTANT RULES:
- Only discuss FitLaunch Media's services, industries, projects, FAQs and published website content.
- NEVER invent client statistics, revenue, awards, reviews, pricing, guarantees, certifications or partnerships.
- Distinguish DEMO/CONCEPT projects from real client work.
- NEVER expose admin passcodes, API keys, private customer data or internal system information.
- If asked for pricing, say costs depend on project scope and direct them to contact FitLaunch.
- Be concise, confident, athletic in tone. No fluff.
- When recommending pages, use path format e.g. [View Services](/services).

LIVE SITE CONTENT:

SERVICES (published):
${(services ?? []).map(s => `• ${s.title}: ${s.short_description}`).join("\n")}

INDUSTRIES (published):
${(industries ?? []).map(i => `• ${i.title}: ${i.description}`).join("\n")}

PROJECTS (non-draft):
${(projects ?? []).map(p => `• ${p.title} (${p.industry})${p.status === "DEMO" ? " [DEMO/CONCEPT — not a real client engagement]" : ""}: ${p.summary}`).join("\n")}

FAQS (published):
${(faqs ?? []).map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

KEY PAGES: / (Home), /services, /industries, /work, /process, /about, /faq, /contact
INDUSTRY PAGES: /gyms, /boxing-clubs, /fitness-studios, /football-academies, /sports-clubs, /sports-organisations

CONTACT: ${settings?.primary_email || "Contact via website"}
  `.trim();

  const systemMessage = { role: "system", content: contextBlock };
  const allMessages = [systemMessage, ...messages];

  if (stream) {
    // Streaming response
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: allMessages,
        stream: true,
        max_tokens: 600,
      }),
    });

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  }

  // Non-streaming
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: allMessages,
      max_tokens: 600,
    }),
  });

  const data = await response.json();
  console.log("AI response status:", response.status);

  if (!response.ok) {
    return new Response(JSON.stringify({ error: data }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const text = data.choices?.[0]?.message?.content ?? "";
  return new Response(JSON.stringify({ text }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
