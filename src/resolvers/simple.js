const PROTOCOL = "http";

/**
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} reply
 * @param {Object} route
 */
async function simple(req, reply, route) {
  const { method, to, endpoint } = route;

  const url = new URL(`${PROTOCOL}://${endpoint}${to}`);

  const headers = new Headers(req.headers);

  // Why do we need to do so?
  headers.delete("host");
  headers.delete("connection");

  const body = req.body ? JSON.stringify(req.body) : undefined;
  const contentLength = body ? body.length : 0;

  headers.set("content-length", contentLength);

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  const responseBody = await response.text();
  const responseHeaders = Object.fromEntries(response.headers.entries());

  reply.status(response.status).headers(responseHeaders).send(responseBody);

  // return { ...route, url, status: response.status };
}

module.exports = simple;
