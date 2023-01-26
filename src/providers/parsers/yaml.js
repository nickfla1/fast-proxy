const yaml = require("yaml");
const { ParsingError } = require("./errors");

const ajv = new (require("ajv"))();

const DEFAULT_RESOLVER = "simple";
const DEFAULT_METHOD = "GET";

const validateRouteSchema = ajv.compile({
  type: "object",
  properties: {
    to: { type: "string" },
    match: { type: "string" },
    endpoint: { type: "string" },
    resolver: { type: "string" }
  },
  required: ["to", "match", "endpoint", "resolver"]
});

function normalizeAndValidateRoutes (options, routes) {
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
      throw new ParsingError("invalid routes", validateRouteSchema.errors);
    }
  }

  return routes;
}

/**
 * @param {String} content
 * @returns {Object}
 */
function parse (content) {
  const object = yaml.parse(content);
  if (!object) {
    throw new ParsingError("empty routes");
  }

  if (!object.routes) {
    throw new ParsingError("missing routes mapping");
  }

  return normalizeAndValidateRoutes(object.options ?? {}, object.routes);
}

module.exports = parse;
