const fastifyPlugin = require("fastify-plugin");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
async function routes(fastify) {
  fastify.decorate("stateRoutes", require("../providers/filesystem")());
}

module.exports = fastifyPlugin(routes);
