const { src, dest } = require("gulp");
const { parse } = require("yaml");
const beautify = require("gulp-beautify");
const concat = require("gulp-concat");
const wrap = require("gulp-wrap");

const Transform = require("stream").Transform;

const template = (filename, routes) =>
  `
  // File: ${filename}
  ${Object.entries(routes)
    .map(
      ([name, route]) =>
        `
        // ${name}
      router.on("${route.method || "GET"}", "${
          route.match
        }", (req, res, params) => {
      return resolvers["${
        route.resolver || "simpleRedirect"
      }"](req, res, params, {${Object.entries(route)
          .map(([k, v]) => `${k}: "${v}"`)
          .join(",")}});
    });`
    )
    .join("\n")}`;

function transformYamlRoute() {
  const transformStream = new Transform({ objectMode: true });

  transformStream._transform = function (originalFile, encoding, callback) {
    const file = originalFile.clone({ contents: false });
    const parsed = parse(originalFile.contents.toString(encoding));

    if (!parsed) {
      file.contents = Buffer.from("");
      callback(null, file);
      return;
    }

    if (!parsed.routes || typeof parsed.routes !== "object") {
      callback(
        new TypeError(
          "yaml is either missing 'routes' or is not correctly formatted"
        ),
        undefined
      );
      return;
    }

    // Spread options
    if (parsed.options) {
      const { protocol, endpoint } = parsed.options;

      for (const [_, route] of Object.entries(parsed.routes)) {
        if (endpoint && !route.endpoint) {
          route.endpoint = endpoint;
        }
        if (protocol && !route.protocol) {
          route.protocol = protocol;
        }
      }

      delete parsed.options;
    }

    for (const [name, route] of Object.entries(parsed.routes)) {
      if (!route.protocol) {
        route.protocol = "http";
      }
      if (!route.method) {
        route.method = "GET";
      }
      if (!route.resolver) {
        route.resolver = "simpleRedirect";
      }
      if (!route.to) {
        route.to = route.match;
      }

      if (!route.match) {
        callback(
          new TypeError(`route '${name}' is missing the 'match' property`)
        );
        return;
      }

      route.name = name;
    }

    const t = template(originalFile.relative, parsed.routes);

    file.contents = Buffer.from(t);

    callback(null, file);
  };

  return transformStream;
}

function defaultTask() {
  return src("routes/*.yml")
    .pipe(transformYamlRoute())
    .pipe(concat("routes.js"))
    .pipe(
      wrap(`module.exports = function(router, resolvers) { <%= contents %> };`)
    )
    .pipe(beautify.js({ indent_size: 2 }))
    .pipe(dest("src/generated/"));
}

module.exports.default = defaultTask;
