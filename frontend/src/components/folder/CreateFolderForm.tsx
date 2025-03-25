import React, {useState} from 'react';
import {useFolderCRUD} from "../../hooks/folder/useFolderCRUD.ts";

export const CreateFolderForm = () => {
    const [name, setName] = useState('');
    const {createFolder, isCreatingFolder, errorCreateFolder} = useFolderCRUD();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            await createFolder(name.trim());
            setName('');
        } catch (error) {
            console.error('Failed to create folder:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-lg font-bold mb-4">Create New Folder</h3>
            <div className="join w-full">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter folder name"
                    className="input input-bordered join-item flex-1"
                    disabled={isCreatingFolder}
                    maxLength={50} // Aggiungi limitazione caratteri
                />
                <button
                    type="submit"
                    className="btn btn-primary join-item"
                    disabled={isCreatingFolder || !name.trim()}
                >
                    {isCreatingFolder ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        'Create Folder'
                    )}
                </button>
            </div>

            {errorCreateFolder && (
                <div className="text-error mt-2">
                    Error: {errorCreateFolder.message}
                </div>
            )}
        </form>
    );
};