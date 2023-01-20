const fastifyPlugin = require("fastify-plugin");
const fs = require("fs");
const path = require("path");
const yaml = require("yaml");

const ajv = new (require("ajv"))();

const ROUTES_DIR = "routes";
const SUPPORTED_FILE_EXTS = [".yml", ".yaml"];

const DEFAULT_RESOLVER = "simple";
const DEFAULT_METHOD = "GET";

const validateRouteSchema = ajv.compile({
  type: "object",
  properties: {
    to: { type: "string" },
    match: { type: "string" },
    endpoint: { type: "string" },
    resolver: { type: "string" },
  },
  required: ["to", "match", "endpoint", "resolver"],
});

function normalizeRoutes(options, routes) {
  for (const key of Object.keys(routes)) {
    const route = routes[key];

    // Spread options
    if (options.endpoint && !route.endpoint) {
      route.endpoint = options.endpoint;
    }
    if (options.resolver && !route.resolver) {
      route.resolver = options.resolver;
    }

    // Normalize route
    if (route.match && !route.to) {
      route.to = route.match;
    } else if (route.to && !route.match) {
      route.match = route.to;
    }
    if (!route.method) {
      route.method = DEFAULT_METHOD;
    }
    if (!route.resolver) {
      route.resolver = DEFAULT_RESOLVER;
    }

    // Validate resulting route
    const valid = validateRouteSchema(route);
    if (!valid) {
      return { result: null, error: validateRouteSchema.errors };
    }
  }

  return { result: routes, error: null };
}

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
async function stateRoutes(fastify) {
  const files = fs.readdirSync(ROUTES_DIR);

  const supportedFiles = files.filter((file) =>
    SUPPORTED_FILE_EXTS.includes(path.extname(file))
  );

  const state = new Map();

  supportedFiles.forEach((file) => {
    const contents = fs.readFileSync(path.join(ROUTES_DIR, file));
    const { routes, options } = yaml.parse(contents.toString("utf-8"));

    const { result, error } = normalizeRoutes(options ?? {}, routes);
    if (error) {
      fastify.log.error(error);
      return;
    }

    const { name } = path.parse(file);
    state.set(name, result);
  });

  fastify.decorate("stateRoutes", state);
}

module.exports = fastifyPlugin(stateRoutes);
