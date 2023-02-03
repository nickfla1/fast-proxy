const app = require("avvio")();

app.use(function (instance, _, done) {
  instance.config = require("./src/config")();
  done();
});

app.use(async function (instance, _, done) {
  await require("./src/server")(instance.config);
  done();
});
