import React, {useState} from 'react';
import {useFolder} from '../../hooks/useFolder';
import {useCourse} from "../../hooks/useCourse";

const CreateFolderForm = () => {
    const [name, setName] = useState('');
    const {createFolder, isLoading} = useFolder();
    const {fetchCourses} = useCourse();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            try {
                await createFolder(name);
                await fetchCourses();
                setName('');
            } catch (error) {
                console.error('Failed to create folder:', error);
            }
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
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="btn btn-primary join-item"
                    disabled={isLoading || !name.trim()}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        'Create Folder'
                    )}
                </button>
            </div>
        </form>
    );
};

export default CreateFolderForm;