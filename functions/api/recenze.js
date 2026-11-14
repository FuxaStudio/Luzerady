// Cloudflare Pages Function: GET /api/recenze -> {rating, count} z Google Places API.
// V nastavení Pages doplnit proměnné GOOGLE_API_KEY a GOOGLE_PLACE_ID (Place ID Lužerad).
// Odpověď se cachuje 24 h, takže Google se volá zhruba jednou denně.
export async function onRequestGet({ env }) {
  const r = await fetch(`https://places.googleapis.com/v1/places/${env.GOOGLE_PLACE_ID}`, {
    headers: { 'X-Goog-Api-Key': env.GOOGLE_API_KEY, 'X-Goog-FieldMask': 'rating,userRatingCount' },
    cf: { cacheTtl: 86400, cacheEverything: true },
  });
  if (!r.ok) return new Response('{}', { status: 502, headers: { 'content-type': 'application/json' } });
  const d = await r.json();
  return Response.json({ rating: d.rating, count: d.userRatingCount }, { headers: { 'cache-control': 'public, max-age=86400' } });
}
