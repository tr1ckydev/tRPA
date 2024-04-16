import type { DecodeStrategy } from "./index.ts";

type Promisify<T> = {
    [K in keyof T]: T[K] extends (...args: infer Args) => any
    ? (...args: Args) => Promise<Awaited<ReturnType<T[K]>>>
    : T[K] extends any[] ? Promise<T[K]>
    : T[K] extends Record<string, any> ? Promisify<T[K]>
    : Promise<T[K]>;
};

interface ClientConfig {
    host?: string;
}

export async function importFromServer<T>(config?: ClientConfig) {
    const server_exports = await (await fetch((config?.host ?? "") + "/trpa/exports")).json() as Record<string, any>;
    return createProperties([], server_exports, config) as Promisify<T>;
}

function createProperties(accessors: string[], server_exports: Record<string, any>, config?: ClientConfig) {
    const obj: Record<string, any> = {};
    for (const prop in server_exports) {
        const val = server_exports[prop];
        switch (val) {
            case "function":
                Object.defineProperty(obj, prop, {
                    get: () => (...args: any[]) => executeFunction([...accessors, prop], args, config),
                });
                break;
            case "any":
                Object.defineProperty(obj, prop, {
                    get: () => accessProperty([...accessors, prop], config),
                });
                break;
            default:
                obj[prop] = createProperties([...accessors, prop], val, config);
        }
    }
    return obj;
}

async function accessProperty(accessors: string[], config?: ClientConfig) {
    const result = await fetch((config?.host ?? "") + "/trpa/access?accessors=" + accessors.join(","));
    return decodeResponse(result);
}

async function executeFunction(accessors: string[], args: any[], config?: ClientConfig) {
    let fetch_options: FetchRequestInit | undefined;
    if (typeof args[0] === "object" && "decode_strategy" in args[0]) {
        const { decode_strategy, body } = args.shift();
        fetch_options = {
            method: "POST",
            headers: { "Decode-Strategy": decode_strategy },
            body,
        };
    }
    const result = await fetch((config?.host ?? "") + "/trpa/execute?" + new URLSearchParams({
        accessors,
        args: JSON.stringify(args ?? "[]"),
    }), fetch_options);
    return decodeResponse(result);
}

async function decodeResponse(result: Response) {
    const decode_strategy = result.headers.get("Decode-Strategy") as DecodeStrategy;
    if (decode_strategy) return result[decode_strategy]();
    return (await result.json() as { value: any; }).value;
}

export { asBody } from "./index.ts";
