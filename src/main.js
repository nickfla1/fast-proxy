const http = require("http");
const router = require("find-my-way")();

const logger = require("./logger");
const routes = require("./generated/routes");
const resolvers = require("./resolvers");

const PORT = process.env.PORT || 3000;

routes(router, resolvers);

const server = http.createServer((req, res) => {
  router.lookup(req, res);
});

server.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  logger.info(`Server listening on port ${PORT}`);
});
