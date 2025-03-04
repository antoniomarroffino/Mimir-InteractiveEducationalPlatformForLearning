import { useState } from 'react';
import { useCreateFolder } from '../../hooks/useFolders';

interface CreateFolderFormProps {
    courseId: string;
}

const CreateFolderForm = ({ courseId }: CreateFolderFormProps) => {
    const [name, setName] = useState('');
    const createFolder = useCreateFolder(courseId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            await createFolder.mutate(name);
            setName('');
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
                    disabled={createFolder.isLoading}
                />
                <button
                    type="submit"
                    className="btn btn-primary join-item"
                    disabled={createFolder.isLoading || !name.trim()}
                >
                    {createFolder.isLoading ?
                        <span className="loading loading-spinner"></span> :
                        'Create Folder'
                    }
                </button>
            </div>
        </form>
    );
};

export default CreateFolderForm;