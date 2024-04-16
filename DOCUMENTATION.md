# Installation

## Bun

```bash
bun i trpa
```

- Server: `import { ... } from "trpa/server"`
- Client: `import { ... } from "trpa/client"`

## Deno

- Server: `import { ... } from "https://unpkg.com/trpa/src/server.ts";`
- Client: `import { ... } from "https://unpkg.com/trpa/src/client.ts";`



# `exportToClient`

This is the main server side function that handles all the exporting logic.

Returns a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object.

`exportToClient({ exports, request })`

- `exports`: The object containing the functions and properties to be exported to client.
- `request`: A [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object from the web server.



# `importFromServer`

This is the main client side function that imports all the exported functions and properties from the server and makes them available to the client for accessing or executing.

Returns the exported properties and functions from server.

`importFromServer<T>({ host? })`

`T` is the type for `exports` object provided in server. This gives TypeScript intellisense and auto completions.

- `host`: (Optional) Provide a host url for tRPA if client is running separately from the server.



> [!IMPORTANT]  
> Imported properties and functions will be promisified as every property access or function execution sends a fetch request and hence needs to be `await`ed on client side.



# `asBody`

This allows you to explicitly send data as the body of a request or a response which allows more kinds of data to be sent/received between client and server.

Supported data types are [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob), [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData), JSON, text.

By default function arguments are sent as url parameters. To send a complex data as an argument for the function, you can send it as the request body by wrapping it within the `asBody(...)` function and passing it as the ***first argument of the function***. tRPA only checks and decodes the first argument, so you'd need to define the server function accordingly. This allows the server to receive such data which wasn't possible before to be sent as a url parameter.

Check out `examples/asBody/` for an example use case of this.