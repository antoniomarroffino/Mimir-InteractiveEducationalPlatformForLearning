import { useState } from 'react';
import { useCreateFolder } from '../hooks/useFolders';
import styles from './FolderList.module.css';

const CreateFolderForm: React.FC = () => {
    const [name, setName] = useState('');
    const createFolder = useCreateFolder();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            await createFolder.mutate(name);
            setName('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter folder name"
                className={styles.input}
            />
            <button
                type="submit"
                disabled={createFolder.isLoading || !name.trim()}
                className={styles.button}
            >
                {createFolder.isLoading ? 'Creating...' : 'Create Folder'}
            </button>
        </form>
    );
};

export default CreateFolderForm;