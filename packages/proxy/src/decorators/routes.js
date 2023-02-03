const fastifyPlugin = require("fastify-plugin");

const fileProvider = require("@fast/provider-file");
const yamlParser = require("@fast/parser-yaml");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
async function routes (fastify) {
  const parsers = {
    yaml: yamlParser,
    yml: yamlParser
  };

  fastify.decorate(
    "stateRoutes",
    fileProvider(
      fastify.config.routesProviders[fastify.config.routesProvider],
      parsers
    )
  );
}

module.exports = fastifyPlugin(routes);
