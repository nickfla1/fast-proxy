const fs = require("fs");
const yaml = require("yaml");

const CONFIG_NAME = ".fast";
const CONFIG_EXTS = [".yaml", ".yml"];

const DEFAULT_PORT = 3000;

function loadFile() {
  for (const ext of CONFIG_EXTS) {
    try {
      const filename = `${CONFIG_NAME}${ext}`;
      return yaml.parse(fs.readFileSync(filename).toString());
    } catch (error) {
      // Do nothing
    }
  }

  return null;
}

function loadConfigFromCWD() {
  const config = loadFile();

  return {
    port: config?.port || DEFAULT_PORT,
  };
}

module.exports = loadConfigFromCWD;
