/**
 * @param {import("fastify").FastifyInstance} fastify
 */
async function routes(fastify) {
  const routes = fastify.stateRoutes;

  routes.forEach((group) => {
    for (const routeName of Object.keys(group)) {
      const { resolver, ...route } = group[routeName];

      fastify.route({
        method: route.method,
        url: route.match,
        handler: (req, reply) => {
          return fastify.resolvers[resolver](fastify, req, reply, route);
        },
      });
    }
  });
}

module.exports = routes;
