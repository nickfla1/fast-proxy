async function server(config) {
  const { port } = config;

  const fastify = require("fastify")({
    logger: true,
  });

  fastify.register(require("./state/routes"));
  fastify.register(require("./resolvers"));
  fastify.register(require("./routes/state"));
  fastify.register(require("./routes/proxy"));

  try {
    await fastify.listen({ port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

module.exports = server;
