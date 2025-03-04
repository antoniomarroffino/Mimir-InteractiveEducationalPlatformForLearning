import { useFolders } from '../../hooks/useFolders';
import FolderCard from './FolderCard';

interface FolderListProps {
    courseId: string;
}

const FolderList = ({ courseId }: FolderListProps) => {
    const { data: folders, isLoading } = useFolders(courseId);

    if (isLoading) return <div className="loading loading-spinner loading-lg"></div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders?.map(folder => (
                <FolderCard
                    key={folder.id}
                    folder={folder}
                    courseId={courseId}
                />
            ))}
        </div>
    );
};

export default FolderList;