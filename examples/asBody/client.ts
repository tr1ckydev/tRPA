import { importFromServer, asBody } from "../../src/client";
import { type Exports } from "./server";
//       ☝️ only the types are imported from the server-side

const server = await importFromServer<Exports>({
    host: "http://localhost:3000"
});

const buf = new ArrayBuffer(1);
const arr = new Uint8Array(buf);
arr[0] = 0;

console.log("Before:", buf);
console.log("After:", await server.addOne(asBody(buf)));