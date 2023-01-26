const PROTOCOL = "http";
const METHODS_WITH_BODY = ["POST", "PUT", "PATCH", "DELETE"];

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} reply
 * @param {Object} route
 */
async function simple (fastify, req, reply, route) {
  const { method, to, endpoint } = route;

  const url = `${PROTOCOL}://${endpoint}${to}`;
  const headers = new fetch.Headers(req.headers);

  // Why do we need to do so?
  headers.delete("host");
  headers.delete("connection");

  const body =
    METHODS_WITH_BODY.includes(method) && req.body
      ? JSON.stringify(req.body)
      : undefined;

  if (body) {
    headers.set("content-length", body.length);
  }

  reply.header("x-fast-proxy-proxied-url", url);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body
    });

    reply
      .headers(Object.fromEntries(response.headers.entries()))
      .status(response.status)
      .send(await response.text());
  } catch (error) {
    fastify.log.error(error);

    reply
      .header("x-fast-proxy-error", true)
      .status(500)
      .send({
        status: "error",
        message: `error while proxying to ${method} ${url}`,
        error: error.message
      });
  }
}

module.exports = simple;
