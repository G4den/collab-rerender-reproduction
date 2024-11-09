"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import * as Y from "yjs";

const CollabContext = createContext<{
    provider: HocuspocusProvider | null;
    doc: Y.Doc | null;
    isReady: boolean;
    hasSynced: boolean;
}>({ provider: null, doc: null, isReady: false, hasSynced: false });

interface CollabProviderProps {
    documentId: string;
    children: ReactNode;
}

export function DocumentProvider({
    documentId,
    children,
}: CollabProviderProps) {
    const [providerAndDoc, setProviderAndDoc] = useState<{
        provider: HocuspocusProvider | null;
        doc: Y.Doc | null;
        hasSynced: boolean;
    }>({ provider: null, doc: null, hasSynced: false });
    const [isInitializing, setIsInitializing] = useState(false);

    const initializeProvider = async () => {
        if (isInitializing) return;
        // If we already have a valid provider and doc for this documentId, don't reinitialize
        if (providerAndDoc.provider && providerAndDoc.doc) return;

        setIsInitializing(true);
        try {
            // Cleanup existing provider and doc
            providerAndDoc.doc?.destroy();
            providerAndDoc.provider?.destroy();

            const doc = new Y.Doc();
            const newProvider = new HocuspocusProvider({
                url:
                    process.env.NEXT_PUBLIC_COLLAB_SERVER_URL ?? "https://localhost:1234",
                name: documentId,
                document: doc,
            });

            newProvider.on("synced", () => {
                setProviderAndDoc((prev) => ({ ...prev, hasSynced: true }));
            });

            setProviderAndDoc({ provider: newProvider, doc, hasSynced: false });
        } catch (error) {
            console.error("Failed to initialize provider:", error);
            setProviderAndDoc({ provider: null, doc: null, hasSynced: false });
        } finally {
            setIsInitializing(false);
        }
    };
    useEffect(() => {
        void initializeProvider();

        return () => {
            providerAndDoc.doc?.destroy();
            providerAndDoc.provider?.destroy();
        };
    }, [documentId]);

    return (
        <CollabContext.Provider
            value={{
                ...providerAndDoc,
                isReady: !!providerAndDoc.provider && !!providerAndDoc.doc,
            }}
        >
            {children}
        </CollabContext.Provider>
    );
}

// Hook to use the collab provider and doc
export function useDocumentProvider() {
    const context = useContext(CollabContext);
    return context;
}
