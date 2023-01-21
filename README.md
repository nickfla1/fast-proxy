# fast-proxy

> Temporary name :shrug:

An experimental HTTP proxy with "not-so-good" ideas.

## Table of Contents

- [Application config](#config)
    - [Example config](#config-example)
    - [Format](#config-format)
        - [Basic config](#config-format-basic)
        - [Route Providers](#config-format-providers)
        - [Route Resolvers](#config-format-resolvers)
- [Routes configuration](#routes)
    - [Example config](#routes-example)
    - [Format](#routes-format)
        - [Route definition](#routes-format-route)
        - [Options](#routes-format-options)

## Application configuration <a name="config"></a>

Configuration is read from a file named `.fast.yaml` or `.fast.yml`. The file must be located in the directory where the application is running. If no file is provided, default configurations values are used.

### Example config <a name="config-example"></a>

```yaml
port: 3000
```

### Format <a name="config-format"></a>

#### Basic config

```yaml
# Port on which to run the proxy server
#
# Optional
# Default: 3000
port: 3000

# Name of the provided that will be used to read the route configuration
# Supported providers are:
# - filesystem
#
# Optional
# Default: "filesystem"
routesProvider: filesystem
```

#### Route Providers <a name="config-format-providers"></a>

```yaml
# Route providers mapping
#
# Required
routesProviders:

    # The `filesystem` route provider configuration
    #
    # Required if `routesProvider` is "filesystem"
    filesystem:
        # Directory where route configs are found
        #
        # Required
        routesDir: routes
```

#### Route Resolvers <a name="config-format-resolvers"></a>

This section is used to add custom resolvers plugins.

```yaml
# fast-proxy will use the key from the mapping to add a custom resolver
# The value of the mapping is the location or identifier of the plugin
# Supported protocols are:
# - File: file://../plugin/index.js
# - NPM Registry: npm://foo-plugin
# - GIT: git://foo/bar.git
# 
# NOTE: in order for plugins to work you either must point to the javascript file
# if not specified it will look for the `index.js` file in the root of the location
resolvers:
    resolver-name: git://foo/bar.git
```

## Routes configuration <a name="routes"></a>

### Example config <a name="routes-example">

```yaml
routes:
    get-users:
        match: /users
        endpoint: example.com
    get-planes:
        match: /planes/:from/:to
        endpoint: flight.example.com
    buy-tickets:
        match: /planes/:from/:to
        method: POST
        endpoint: flight.example.com
```

This will result in the following routes registered:

```js
router.on("GET", "/users", (/* ... */) => { /* ... */ });
router.on("GET", "/planes/:from/:to", (/* ... */) => { /* ... */ });
router.on("POST", "/planes/:from/:to", (/* ... */) => { /* ... */ });
```

### Format <a name="routes-format"></a>

Each yaml file is considered a group of routes and it's independent from other groups.

#### Route definition <a name="routes-format-route"></a>

```yaml
# Identifies the main route object
# Required
routes:
    
    # Name of the route, currently unused
    route-name: 
        
        # Actual route that will be registered on the proxy
        #
        # Optional if `match` is set
        # Default: value of `match`
        match: /route
        
        # Destination path of the proxied route
        #
        # Optional if `match` is set
        # Default: value of `match`
        to: /final-route

        # Method take will be used to both match the incoming request
        # and as the actual method that will be proxied
        #
        # Optional
        # Default: "GET"
        method: GET

        # Endpoint (hostname) of the proxied route
        #
        # Required
        endpoint: example.com

        # Name of the resolver used to handle the proxied required
        #
        # Optional
        # Default: "simple"
        resolver: simple
```

#### Options <a name="routes-format-options"></a>

Options are shared across all routes in the same file.

```yaml
# Optional
options:
    # Supported shared options are:
    # - endpoint
    # - resolver
```
