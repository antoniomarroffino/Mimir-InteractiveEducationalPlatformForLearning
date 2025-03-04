import { Configuration, FolderControllerApi } from '../generated';

const config = new Configuration({
    basePath: process.env.REACT_APP_API_URL,
});

export const folderApi = new FolderControllerApi(config);