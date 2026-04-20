/**
 * Cloudflare Pages middleware for /learn/*.
 *
 * CheerpJ fetches .jar files via HTTP Range requests to stream class
 * bytecode lazily. Cloudflare's CDN does not honor Range on static
 * assets under ~2 MB — it serves the full body with HTTP 200.
 * This middleware intercepts .jar requests, fetches the full body from
 * the static bucket via next(), and serves the requested byte range
 * with HTTP 206. Non-.jar paths pass through unchanged.
 *
 * DEBUG (temporary): a diagnostic header X-Middleware is set on every
 * .jar response so we can confirm the middleware actually ran.
 */
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  if (!url.pathname.endsWith('.jar')) {
    return next();
  }

  const upstream = await next();
  if (!upstream.ok) return upstream;

  const body = await upstream.arrayBuffer();
  const total = body.byteLength;

  // no-store:
  //   Cloudflare Pages appears to cache Function output despite
  //   Cache-Control: private. Using no-store is a hard "don't cache"
  //   that also prevents the Range-vs-no-Range cache-key collision
  //   (same URL → different bodies depending on request header).
  //   CheerpJ still gets browser-side HTTP/2 connection reuse, so the
  //   cost is just a CF edge miss per Range chunk.
  const baseHeaders = {
    'Content-Type': 'application/octet-stream',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store',
    'X-Middleware': 'tetris-jar-range',
  };

  const range = request.headers.get('Range');
  if (!range) {
    return new Response(body, {
      status: 200,
      headers: { ...baseHeaders, 'Content-Length': String(total) },
    });
  }

  const m = /^bytes=(\d+)-(\d*)$/.exec(range);
  if (!m) {
    return new Response('Invalid Range', { status: 400 });
  }

  const start = parseInt(m[1], 10);
  let end = m[2] === '' ? total - 1 : parseInt(m[2], 10);
  if (end >= total) end = total - 1;

  if (start < 0 || start > end) {
    return new Response(null, {
      status: 416,
      headers: { ...baseHeaders, 'Content-Range': `bytes */${total}` },
    });
  }

  const slice = body.slice(start, end + 1);
  return new Response(slice, {
    status: 206,
    headers: {
      ...baseHeaders,
      'Content-Length': String(slice.byteLength),
      'Content-Range': `bytes ${start}-${end}/${total}`,
    },
  });
}
