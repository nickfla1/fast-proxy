const app = require("avvio")();

app.use(function (instance, _, done) {
  instance.config = require("./config")();
  done();
});

app.use(async function (instance, _, done) {
  await require("./server")(instance.config);
  done();
});
