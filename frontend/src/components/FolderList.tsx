import { useFolders } from '../hooks/useFolders';
import FolderItem from './FolderItem';
import CreateFolderForm from './CreateFolderForm';
import styles from './FolderList.module.css';

const FolderList: React.FC = () => {
    const { data: folders, isLoading, error } = useFolders();

    if (isLoading) return <div>Loading folders...</div>;
    if (error) return <div>Error loading folders</div>;

    return (
        <div className={styles.folderList}>
            <h2>Folders</h2>
            <CreateFolderForm />
            <div className={styles.list}>
                {folders?.map(folder => (
                    <FolderItem key={folder.id} folder={folder} />
                ))}
            </div>
        </div>
    );
};

export default FolderList;


