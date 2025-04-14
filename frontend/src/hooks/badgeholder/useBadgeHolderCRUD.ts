import { useMutation, useQueryClient } from 'react-query';
import { BadgeType, Badge } from '@dti-isin/backend-api-client';
import { badgeHolderApi } from "../../../config/config.ts";

interface AssignBadgeParams {
    azureOID: string;
    badgeType: BadgeType;
    assignedBy: string;
}

export const useBadgeHolderCRUD = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ azureOID, badgeType, assignedBy }: AssignBadgeParams) => {
            const badge: Badge = {
                type: badgeType,
                assignedAt: new Date().toISOString(),
                assignedBy
            };

            return await badgeHolderApi.apiBadgeHoldersAzureOIDBadgesPost({
                azureOID: azureOID,
                badge: badge
            });
        },
        onSuccess: (_data, params) => {
            queryClient.invalidateQueries(['badgeHolders'])
            queryClient.invalidateQueries(['badgeHolders', params.azureOID]);
            queryClient.invalidateQueries(['quizAttempts'])
        },
        onError: (error) => {
            console.error('Failed to assign badge:', error);
            throw error;
        }
    });
};