import { exportToClient, asBody } from "../../src/server";

const exports = {
    addOne(buf: ArrayBuffer) {
        const arr = new Uint8Array(buf);
        arr[0]++;
        return asBody(buf);
    }
};

export type Exports = typeof exports;

Bun.serve({
    fetch(request) {
        return exportToClient({ exports, request });
    },
    port: 3000
});