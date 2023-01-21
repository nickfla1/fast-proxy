# fast-proxy

> Temporary name :shrug:

An experimental HTTP proxy with "not-so-good" ideas.

## Table of Contents

- [Application config](#config)
    - [Example config](#config-example)
    - [Format](#config-format)
        - [Basic configs](#config-format-basic)
        - [Route Providers](#config-format-providers)
        - [Route Resolvers](#config-format-resolvers)
- [Routes configuration](#routes)
    - [Example config](#routes-example)
    - [Format](#routes-format)
        - [Route definition](#routes-format-route)
        - [Options](#routes-format-options)

## Application configuration <a name="config"></a>

TODO

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
