import { useFolders } from '../../hooks/useFolders';
import FolderItem from './FolderItem';

interface FolderListProps {
    courseId: string;
}

const FolderList = ({ courseId }: FolderListProps) => {
    const { data: folders, isLoading } = useFolders(courseId);

    if (isLoading) return <div className="loading loading-spinner loading-lg"></div>;

    return (
        <div className="flex flex-col gap-2">
            {folders?.map(folder => (
                <FolderItem
                    key={folder.id}
                    folder={folder}
                    courseId={courseId}
                />
            ))}
            {folders?.length === 0 && (
                <div className="text-center py-8 text-base-content/70">
                    No folder presents
                </div>
            )}
        </div>
    );
};

export default FolderList;