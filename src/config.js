const fs = require("fs");
const yaml = require("yaml");

const ajv = new (require("ajv"))();

const CONFIG_NAME = ".fast";
const CONFIG_EXTS = [".yaml", ".yml"];

const DEFAULT_PORT = 3000;
const DEFAULT_ROUTES_PROVIDER = "filesystem";

const validateConfigSchema = ajv.compile({
  type: "object",
  properties: {
    port: { type: "number" },
    routesProvider: { enum: ["filesystem"] },
    routesProviders: {
      type: "object",
      properties: {
        filesystem: {
          type: "object",
          properties: {
            routesDir: { type: "string" },
          },
          required: ["routesDir"],
        },
      },
    },
    resolvers: { type: "object" },
  },
});

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

  if (config) {
    const valid = validateConfigSchema(config);
    if (!valid) {
      console.error(validateConfigSchema.errors);
      throw new Error("invalid configuration");
    }
  }

  return {
    port: config?.port || DEFAULT_PORT,
    routesProvider: config?.routesProvider || DEFAULT_ROUTES_PROVIDER,
    routesProviders: config?.routesProviders || {},
  };
}

module.exports = loadConfigFromCWD;
