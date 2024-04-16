import { importFromServer } from "../../src/client";
import { type Exports } from "./server";
//       ☝️ only the types are imported from the server-side

const server = await importFromServer<Exports>({
    host: "http://localhost:3000"
});

console.log(await server.sayHi("Elysia"));