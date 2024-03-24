import { exportToClient } from "../../src/server";

const exports = {
    hello: "world",
    sayHi(name: string) {
        return `Hi, ${name}`;
    }
};

export type Exports = typeof exports;


Bun.serve({
    fetch(request) {
        return exportToClient({ exports, request });
    },
    port: 3000
});