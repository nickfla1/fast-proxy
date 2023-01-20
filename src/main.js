const PORT = process.env.PORT || 3000;

const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("./state/routes"));
fastify.register(require("./resolvers"));
fastify.register(require("./routes/state"));
fastify.register(require("./routes/proxy"));

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
