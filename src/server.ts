import { basename } from "node:path/posix";
import type { DecodeStrategy } from "./index.ts";

interface ServerConfig {
    exports: Record<string, any>;
    request: Request;
}

export async function exportToClient(config: ServerConfig): Promise<Response> {
    const url = new URL(config.request.url);
    switch (basename(url.pathname)) {
        case "exports": {
            return new Response(JSON.stringify(getAll(config.exports)));
        }
        case "access": {
            const accessors = url.searchParams.get("accessors")!;
            let value = access(config.exports, accessors.split(","));
            return encodeResponse(value);
        }
        case "execute": {
            const accessors = url.searchParams.get("accessors")!.split(",");
            const args = JSON.parse(url.searchParams.get("args")!);
            const decode_strategy = config.request.headers.get(
                "Decode-Strategy",
            ) as DecodeStrategy;
            let value = access(config.exports, accessors);
            value = decode_strategy
                ? await value(await config.request[decode_strategy](), ...args)
                : await value(...args);
            return encodeResponse(value);
        }
        default:
            return new Response("error: unknown route " + url.pathname, {
                status: 404,
            });
    }
}

function encodeResponse(value: any) {
    if (typeof value === "object" && "decode_strategy" in value) {
        return new Response(value.body, {
            headers: { "Decode-Strategy": value.decode_strategy },
        });
    }
    return new Response(JSON.stringify({ value }));
}

function getAll(props: Record<string, any>) {
    const types: Record<string, any> = {};
    for (const key in props) {
        const val = props[key];
        switch (typeof val) {
            case "function":
                types[key] = "function";
                break;
            // @ts-ignore
            case "object":
                if (!Array.isArray(val) && val !== null && !("decode_strategy" in val)) {
                    types[key] = getAll(props[key]);
                    break;
                }
            default:
                types[key] = "any";
        }
    }
    return types;
}

function access(obj: any, accessors: string[]) {
    for (const accessor of accessors) obj = obj[accessor];
    return obj;
}

export function legacy(res: any, response: Response) {
    const decode_strategy = response.headers.get("Decode-Strategy");
    if (decode_strategy) res.setHeader("Decode-Strategy", decode_strategy);
    res.send(response.body);
}

export { asBody } from "./index.ts";
