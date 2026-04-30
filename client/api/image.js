// Vercel Function — POST /api/image
//
// Proxies prompts to pollinations.ai (free, keyless) and returns the image
// as base64. The proxy exists because pollinations.ai rejects browser-origin
// requests with a Cloudflare Turnstile challenge; server-side calls are exempt.
//
// Mirrors the Express version in `server/routes/image.routes.js` — keep the
// two in sync if you change request/response shape. See `server/README.md`
// for why both exist.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Prompt is required." });
  }

  try {
    const seed = Math.floor(Math.random() * 1_000_000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}`;

    const upstream = await fetch(url);
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        message: `Image service returned ${upstream.status}`,
        code: "upstream_error",
      });
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    const image = buffer.toString("base64");
    return res.status(200).json({ photo: image });
  } catch (error) {
    console.error("image generation failed", error);
    return res.status(500).json({ message: "Image generation failed." });
  }
}
