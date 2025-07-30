import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat")
  const lon = req.nextUrl.searchParams.get("lon")
  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: "Missing lat/lon" }), { status: 400 })
  }
  const apiKey = "openuv-kus0rmavj7d6z-io" // Reemplaza por tu API key real de OpenUV
  const url = `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`
  try {
    const uvRes = await fetch(url, {
      headers: { "x-access-token": apiKey },
      next: { revalidate: 3600 }, // cache 1h
    })
    if (!uvRes.ok) {
      return new Response(JSON.stringify({ error: "OpenUV error" }), { status: uvRes.status })
    }
    const data = await uvRes.json()
    return new Response(JSON.stringify(data.result), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 })
  }
}
