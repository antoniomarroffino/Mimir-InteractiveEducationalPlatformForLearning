import { useFolderContext } from '../../contexts/FolderContext';
import { FolderRow } from './FolderRow';
import CreateFolderForm from './CreateFolderForm';

export const FolderList = () => {
    const { folders, isLoading, error } = useFolderContext();

    if (isLoading) {
        return <div className="loading loading-spinner loading-lg"></div>;
    }

    if (error) {
        return <div className="alert alert-error">Error: {error.message}</div>;
    }

    return (
        <div className="space-y-4">
            <CreateFolderForm />
            {!folders.length ? (
                <div className="text-center text-base-content/70 py-8">
                    No folders yet. Create your first folder!
                </div>
            ) : (
                <div className="space-y-2">
                    {folders.map(folder => (
                        <FolderRow
                            key={folder.id}
                            folder={folder}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};