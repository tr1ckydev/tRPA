/**
 * Encode a value to be sent as Request body.
 */
export function asBody<
    T extends ArrayBuffer | Blob | FormData | string | Record<string, any>,
>(body: T) {
    const encoded: { decode_strategy?: string; body: any; } = { body };
    switch (typeof body) {
        case "string":
            encoded.decode_strategy = "text";
            break;
        case "object":
            switch (true) {
                case body instanceof ArrayBuffer:
                    encoded.decode_strategy = "arrayBuffer";
                    break;
                case body instanceof FormData:
                    encoded.decode_strategy = "formData";
                    break;
                case body instanceof Blob:
                    encoded.decode_strategy = "blob";
                    break;
                default:
                    encoded.decode_strategy = "json";
                    encoded.body = JSON.stringify(body);
            }
            break;
        default:
            return body;
    }
    return encoded as unknown as T;
}

export type DecodeStrategy =
    | "arrayBuffer"
    | "blob"
    | "formData"
    | "json"
    | "text"
    | null;
