import { useState, useCallback, useEffect, useRef } from 'react';
import { FolderDTO } from '@dti-isin/backend-api-client';
import { folderService } from '../../services/folderService';

export const useFolder = (courseId: string | null) => {
    const [folders, setFolders] = useState<FolderDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const initialized = useRef(false);

    const fetchFolders = useCallback(async () => {
        if (!courseId || isLoading) return;

        try {
            setIsLoading(true);
            setError(null);
            const data = await folderService.getFoldersInCourse(courseId);
            setFolders(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error fetching folders'));
        } finally {
            setIsLoading(false);
        }
    }, [courseId, isLoading]);

    const createFolder = useCallback(async (name: string) => {
        if (!courseId || isLoading) return;

        try {
            setIsLoading(true);
            setError(null);
            await folderService.createFolder(courseId, name);
            await fetchFolders();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error creating folder'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [courseId, fetchFolders, isLoading]);

    const initializeFolders = useCallback(async () => {
        if (!initialized.current && courseId) {
            try {
                await fetchFolders();
                initialized.current = true;
            } catch (error) {
                console.error('Failed to initialize folders:', error);
            }
        }
    }, [courseId, fetchFolders]);

    useEffect(() => {
        initializeFolders();
    }, [initializeFolders]);

    useEffect(() => {
        setFolders([]);
        setError(null);
        initialized.current = false;
    }, [courseId]);

    return {
        folders,
        isLoading,
        error,
        fetchFolders,
        createFolder,
        selectedFolderId,
        setSelectedFolderId
    };
};