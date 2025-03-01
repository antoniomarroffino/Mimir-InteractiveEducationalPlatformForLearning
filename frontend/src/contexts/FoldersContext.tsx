import { useEffect, useState, createContext, ReactNode } from "react";


export type Folder = {
    id: string;
    name: string;
};

type FoldersContextType = {
    folders: Folder[];
    error: string | null;
    fetchFolders: () => Promise<void>;
};

export const FoldersContext = createContext<FoldersContextType | undefined>(undefined);

export const FoldersProvider = ({ children }: { children: ReactNode }) => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchFolders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/folders`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFolders(data);
        } catch (err) {
            console.error('Errore nel caricamento delle folder:', err);
            setError('Errore nel caricamento delle folder');
        }
    };

    useEffect(() => {
        fetchFolders();
    }, []);

    return (
        <FoldersContext.Provider value={{ folders, error, fetchFolders }}>
            {children}
        </FoldersContext.Provider>
    );
};
