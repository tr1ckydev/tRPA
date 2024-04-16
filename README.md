<div align="center">
	<img src="./res/logo.png" height=200/>
	<h1>tRPA</h1>
	<h3>Remote property access.<br/>Client-server connected like never before.</h3>
</div>



*This project is inspired from [tRPC](https://trpc.io/).*

Access server side properties and functions on client side without any frills, just as if they are one.

- 📦 Framework agnostic API.
- ✨ Full static type safety with auto completion on client.
- 🍃 Zero dependencies and client library weights <1kb (minified).
- ⌛ Get up and running with your existing project in minutes.



[**Check out the dev.to article for behind the scenes of this project 🡢**](https://dev.to/tr1ckydev/trpa-remote-property-access-817)



![](./res/showcase.gif)



## Why tRPA?

RPC only allows you to execute procedures i.e. functions. What about static properties? With tRPA you can do both, access server side properties as well as execute remote functions from client side just as if you would from server side in a really native manner.

There are just two main functions: `exportToClient` and `importFromServer`.

Read the full documentation [here](https://github.com/tr1ckydev/tRPA/blob/main/DOCUMENTATION.md).

Checkout the examples for Bun, Deno, Elysia [here](https://github.com/tr1ckydev/tRPA/tree/main/examples).



## Proxy? Real object.

Unlike tRPC which uses Proxy object on client side to emulate accessing server side procedures, tRPA takes a different approach. It creates a special object with all nested properties and functions as exported and attaches a getter to each of them which does the magic behind the scenes. Which means after exporting, you'll get auto completions even from client developer console.



## Limitations

This project only supports modern runtimes like Bun and Deno as they use the web standard APIs like [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) for their web server frameworks. Hence frameworks like `node:http`, `express`, `fastify`, etc. aren't supported.

This is a fairly new project, so it has some known limitations.

- Doesn't support generator functions
- Cannot send batch requests
- No built in error handling
- Creating instance for an exported class won't work

Feel free to open PRs if you can resolve any such issues.



## License

This project uses MIT License. See [LICENSE](https://github.com/tr1ckydev/tRPA/blob/main/LICENSE) for full license text.
