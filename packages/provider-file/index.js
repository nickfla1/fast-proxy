const fs = require("fs");
const path = require("path");

function provider (config, parsers) {
  const files = fs.readdirSync(config.routesDir);

  const state = new Map();

  files.forEach((file) => {
    const ext = path.extname(file).substring(1);
    const parse = parsers[ext];

    const contents = fs.readFileSync(path.join(config.routesDir, file));
    const routes = parse(contents.toString("utf-8"));

    const { name } = path.parse(file);
    state.set(name, routes);
  });

  return state;
}

module.exports = provider;
