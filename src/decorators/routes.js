const fastifyPlugin = require("fastify-plugin");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
async function routes (fastify) {
  fastify.decorate(
    "stateRoutes",
    require("../providers/filesystem")(
      fastify.config.routesProviders[fastify.config.routesProvider]
    )
  );
}

module.exports = fastifyPlugin(routes);
