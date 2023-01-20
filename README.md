# fast-proxy

An experiemental HTTP proxy with "not-so-good" ideas.

## Example configuration

Basic route configuration
```yaml title="my-apis.yaml"
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

This will resoult in the following routes registered

```js
router.on("GET", "/users", (/* ... */) => { /* ... */ });
router.on("GET", "/planes/:from/:to", (/* ... */) => { /* ... */ });
router.on("POST", "/planes/:from/:to", (/* ... */) => { /* ... */ });
```

## Configuration format

Each yaml file is considered a group of routes and it's indipendent from other groups.

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


# Shared set of options shared across the whole file
# These options are not shared across other files
#
# Optional
options:
    # Supported shared options are:
    # - endpoint
    # - resolver
```
