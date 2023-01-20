const fastifyPlugin = require("fastify-plugin");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
async function resolvers(fastify) {
  fastify.decorate("resolvers", {
    simple: require("./simple"),
  });
}

module.exports = fastifyPlugin(resolvers);
