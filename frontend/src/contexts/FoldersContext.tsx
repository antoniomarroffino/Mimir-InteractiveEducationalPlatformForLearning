import { createContext, useContext } from 'react';
import { FolderControllerApi, Configuration } from '../api/generated';

interface FolderContextType {
    folderApi: FolderControllerApi;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const config = new Configuration({
        basePath: `${import.meta.env.VITE_BACKEND_URL}`
    });

    const folderApi = new FolderControllerApi(config);

    return (
        <FolderContext.Provider value={{ folderApi }}>
            {children}
        </FolderContext.Provider>
    );
};

export const useFolderContext = () => {
    const context = useContext(FolderContext);
    if (!context) {
        throw new Error('useFolderContext must be used within a FolderProvider');
    }
    return context;
};