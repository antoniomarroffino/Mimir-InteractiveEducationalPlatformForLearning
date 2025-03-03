import FolderList from '../components/FolderList';
import React from "react";

const Folders: React.FC = () => {
    return (
        <div className="folders-page">
            <h1>Folder Management</h1>
            <FolderList />
        </div>
    );
};

export default Folders;