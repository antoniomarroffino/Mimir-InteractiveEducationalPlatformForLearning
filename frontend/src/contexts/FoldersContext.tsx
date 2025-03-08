import { createContext, useContext } from 'react';
import { FolderControllerApi, Configuration } from "@dti-isin/backend-api-client";

interface FolderContextType {
    folderApi: FolderControllerApi;
}
