import React, {useState} from 'react';
import {useFolderCRUD} from "../../hooks/folder/useFolderCRUD.ts";
import {FiAlertCircle, FiFolder, FiFolderPlus, FiPlus} from "react-icons/fi";

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
        <div className="mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-2xl border border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <FiFolder className="text-2xl text-primary shrink-0"/>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        New Folder
                    </h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Folder name"
                            className="input input-bordered w-full pl-11 pr-4 focus:ring-2 focus:ring-primary/50"
                            disabled={isCreatingFolder}
                            maxLength={50}
                        />
                        <FiFolderPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary min-w-[160px] gap-2 transition-transform hover:scale-[0.98]"
                        disabled={isCreatingFolder || !name.trim()}
                    >
                        {isCreatingFolder ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <FiPlus className="text-lg" />
                                Create Folder
                            </>
                        )}
                    </button>
                </div>

                <div className="flex justify-between items-center px-1">
                    {errorCreateFolder && (
                        <div className="text-error text-sm flex items-center gap-2">
                            <FiAlertCircle />
                            {errorCreateFolder.message}
                        </div>
                    )}
                    <span className="text-sm text-base-content/40 ml-auto">
                        {name.length}/50
                    </span>
                </div>
            </form>
        </div>
    );
};