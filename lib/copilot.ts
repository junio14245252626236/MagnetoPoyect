// Minimal stub for Copilot integration. Replace with real API call
export async function askCopilot(prompt: string, context?: { jobTitle?: string; company?: string; location?: string }) {
  const apiKey = process.env.COPILOT_API_KEY
  const apiUrl = process.env.COPILOT_API_URL
  if (!apiKey || !apiUrl) return null

  // Example placeholder shape; implement actual fetch per your Copilot API
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ prompt, context }),
      // @ts-ignore - Next.js edge/runtime may require extra options; adapt as needed
      cache: 'no-store',
    } as any)
    if (!res.ok) return null
    const data = await res.json()
    // Expecting data.reply or similar
    return (data.reply as string) || null
  } catch {
    return null
  }
}
