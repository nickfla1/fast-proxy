/**
 * @param {import("fastify").FastifyInstance} fastify
 */
async function routes(fastify) {
  fastify.get("/state", async () => {
    return {
      routes: Object.fromEntries(fastify.stateRoutes.entries()),
    };
  });
}

module.exports = routes;
