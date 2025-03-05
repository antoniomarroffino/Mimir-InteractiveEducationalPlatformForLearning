//import { Folder } from '../api/generated';
import { Folder } from "@dti-isin/backend-api-client";
import styles from './FolderList.module.css';

interface FolderItemProps {
    folder: Folder;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder }) => {
    return (
        <div className={styles.folderItem}>
            <span className={styles.folderName}>{folder.name}</span>
        </div>
    );
};

export default FolderItem;