module.exports = function(router, resolvers) {
  // File: auth.yml

  // todos-by-id
  router.on("GET", "/todos/:id", (req, res, params) => {
    return resolvers["simpleRedirect"](req, res, params, {
      match: "/todos/:id",
      method: "GET",
      endpoint: "jsonplaceholder.typicode.com",
      protocol: "https",
      resolver: "simpleRedirect",
      to: "/todos/:id",
      name: "todos-by-id"
    });
  });

  // comments-by-id
  router.on("GET", "/comments/:id", (req, res, params) => {
    return resolvers["simpleRedirect"](req, res, params, {
      match: "/comments/:id",
      method: "GET",
      endpoint: "jsonplaceholder.typicode.com",
      protocol: "https",
      resolver: "simpleRedirect",
      to: "/comments/:id",
      name: "comments-by-id"
    });
  });

  // users
  router.on("GET", "/users", (req, res, params) => {
    return resolvers["simpleRedirect"](req, res, params, {
      match: "/users",
      method: "GET",
      endpoint: "jsonplaceholder.typicode.com",
      protocol: "https",
      resolver: "simpleRedirect",
      to: "/users",
      name: "users"
    });
  });

  // add-user
  router.on("POST", "/users", (req, res, params) => {
    return resolvers["simpleRedirect"](req, res, params, {
      match: "/users",
      method: "POST",
      endpoint: "jsonplaceholder.typicode.com",
      protocol: "https",
      resolver: "simpleRedirect",
      to: "/users",
      name: "add-user"
    });
  });
};