import type { DecodeStrategy } from "./index.ts";

interface ServerConfig {
    exports: Record<string, any>;
    request: Request;
}

export async function exportToClient(config: ServerConfig) {
    const url = new URL(config.request.url);
    switch (url.pathname) {
        case "/trpa/exports": {
            return Response.json(toExported(config.exports));
        }
        case "/trpa/access": {
            const accessors = url.searchParams.get("accessors")!;
            const value = access(config.exports, accessors.split(","));
            return encodeResponse(value);
        }
        case "/trpa/execute": {
            const accessors = url.searchParams.get("accessors")!.split(",");
            const args = JSON.parse(url.searchParams.get("args")!);
            const decode_strategy = config.request.headers.get("Decode-Strategy") as DecodeStrategy;
            let value = access(config.exports, accessors);
            value = decode_strategy
                ? await value(await config.request[decode_strategy](), ...args)
                : await value(...args);
            return encodeResponse(value);
        }
        default:
            return new Response("error: unknown route " + url.pathname, { status: 404 });
    }
}

function encodeResponse(value: any) {
    if (value.decode_strategy) {
        return new Response(value.body, { headers: { "Decode-Strategy": value.decode_strategy } });
    }
    return Response.json({ value });
}

function toExported(props: Record<string, any>) {
    const types: Record<string, any> = {};
    for (const key in props) {
        const val = props[key];
        switch (typeof val) {
            case "function":
                types[key] = "function";
                break;
            // @ts-ignore
            case "object":
                if (!Array.isArray(val) && val !== null && !(val.decode_strategy)) {
                    types[key] = toExported(val);
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

export { asBody } from "./index.ts";
