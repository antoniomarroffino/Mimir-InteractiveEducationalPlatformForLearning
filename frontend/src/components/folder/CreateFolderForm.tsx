import { useState } from 'react';
import { useFolder } from '../../hooks/useFolder';
import { useCourseContext } from '../../hooks/course/useCourseContext';

export const CreateFolderForm = () => {
    const [name, setName] = useState('');
    const { selectedCourseId } = useCourseContext();
    const { createFolder, isCreating } = useFolder(selectedCourseId || '');

    if (!selectedCourseId) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            try {
                await createFolder(name);
                setName('');
            } catch (error) {
                console.error('Failed to create folder:', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="join w-full">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter folder name"
                className="input input-bordered join-item flex-1"
                disabled={isCreating}
            />
            <button
                type="submit"
                className="btn btn-primary join-item"
                disabled={isCreating || !name.trim()}
            >
                {isCreating ? (
                    <span className="loading loading-spinner"></span>
                ) : (
                    'Create Folder'
                )}
            </button>
        </form>
    );
};