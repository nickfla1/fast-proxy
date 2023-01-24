const fs = require("fs");
const path = require("path");
const parse = require("./parsers/yaml");

const SUPPORTED_FILE_EXTS = [".yml", ".yaml"];

function load(config) {
  const files = fs.readdirSync(config.routesDir);

  const supportedFiles = files.filter((file) =>
    SUPPORTED_FILE_EXTS.includes(path.extname(file))
  );

  const state = new Map();

  supportedFiles.forEach((file) => {
    const contents = fs.readFileSync(path.join(config.routesDir, file));
    const routes = parse(contents.toString("utf-8"));

    const { name } = path.parse(file);
    state.set(name, routes);
  });

  return state;
}

module.exports = load;
