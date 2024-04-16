import { Elysia } from "elysia";
import { exportToClient } from "../../src/server";

const exports = {
    hello: "world",
    sayHi(name: string) {
        return `Hi, ${name}`;
    }
};

export type Exports = typeof exports;

new Elysia()
    .get("/trpa/*", ({ request }) => exportToClient({ exports, request }))
    .listen(3000);