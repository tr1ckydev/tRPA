import { exportToClient } from "../../src/server.ts";

const exports = {
  hello: "world",
  sayHi(name: string) {
    return `Hi, ${name}`;
  },
};

export type Exports = typeof exports;

Deno.serve({ port: 3000 }, (request) => exportToClient({ exports, request }));
