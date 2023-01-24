const { test } = require("tap");

const parse = require("./yaml");

test("parses routes", (t) => {
  const content = `
  routes:
    test:
      endpoint: example.com
      match: /test
      method: POST
      to: /test-to
      resolver: foo
  `;

  const routes = parse(content);

  t.match(routes, {
    test: {
      endpoint: "example.com",
      match: "/test",
      to: "/test-to",
      method: "POST",
      resolver: "foo",
    },
  });

  t.end();
});

test("handles shared options", (t) => {
  const content = `
  options:
    endpoint: example.com
    resolver: test

  routes:
    test:
      match: /test
      method: POST
      to: /test-to
  `;

  const routes = parse(content);

  t.match(routes, {
    test: {
      endpoint: "example.com",
      match: "/test",
      to: "/test-to",
      method: "POST",
      resolver: "test",
    },
  });

  t.end();
});

test("handles to or match defaults", (t) => {
  const contentWithMatch = `
  routes:
    test:
      endpoint: example.com
      match: /test
  `;

  const contentWithTo = `
  routes:
    test:
      endpoint: example.com
      to: /test
  `;

  const matchRoutes = parse(contentWithMatch);
  const toRoutes = parse(contentWithTo);

  t.match(matchRoutes, toRoutes);

  t.end();
});

test("throws on invalid schema", (t) => {
  t.throws(() => {
    const content = `
    routes:
      test:
        endpoint: []
    `;

    parse(content);
  });

  t.end();
});

test("throws on empty", (t) => {
  t.throws(() => {
    parse("");
  });
  t.end();
});

test("throws on missing required fields", (t) => {
  t.throws(() => {
    const content = `
    foo:
      bar: 12
    `;

    parse(content);
  });
  t.end();
});
