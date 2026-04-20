/**
 * Cloudflare Pages middleware for /learn/*.
 *
 * CheerpJ fetches .jar files via HTTP Range requests to stream class
 * bytecode lazily. Cloudflare's CDN, however, does not honor Range on
 * static assets under ~2 MB — it returns the full body with HTTP 200.
 * CheerpJ sees that as "Range unsupported" and bails.
 *
 * This middleware intercepts .jar requests, fetches the full body from
 * the static bucket, and serves the requested byte range with HTTP 206.
 * For non-Range requests and non-.jar paths it's a straight passthrough.
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

  // private + no-transform:
  //  - "private" keeps Cloudflare edge from caching our Range-sensitive
  //    responses (a cached 200 would be served back even for Range
  //    requests, making the middleware pointless).
  //  - browsers may still cache (their cache is per-user, not shared).
  //  - no-transform guarantees no proxy re-compresses the bytes.
  const baseHeaders = {
    'Content-Type': 'application/octet-stream',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'private, max-age=3600, no-transform',
    'Vary': 'Range',
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
