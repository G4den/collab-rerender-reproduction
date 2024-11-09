import { Database } from "@hocuspocus/extension-database";
import { Hocuspocus } from "@hocuspocus/server";
import * as Y from "yjs";
import { Doc } from "yjs";

// In-memory storage
const documents = new Map<string, string>();

// Configure the server
const server = new Hocuspocus({
    port: process.env.PORT ? parseInt(process.env.PORT) : 1234,
}).configure({
    extensions: [
        new Database({
            fetch: async ({ documentName }) => {
                const set = documents.get(documentName);
                if (!set) return null;

                const doc = new Doc();
                if (set) {
                    const uint8Array = new Uint8Array(Buffer.from(set, "base64"));
                    Y.applyUpdate(doc, uint8Array);
                }

                return Y.encodeStateAsUpdate(doc);
            },
            store: async ({ documentName, state }) => {
                const base64State = Buffer.from(state).toString("base64");
                documents.set(documentName, base64State);
            },
        }),
    ],
});

void server.listen();
