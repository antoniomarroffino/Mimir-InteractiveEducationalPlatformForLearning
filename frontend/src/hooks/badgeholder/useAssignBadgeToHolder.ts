import { useMutation, useQueryClient } from 'react-query';
import { BadgeType } from '@dti-isin/backend-api-client';
import { badgeHolderApi } from "../../../config/config.ts";

interface AssignBadgeParams {
    azureOID: string;
    badgeType: BadgeType;
    assignedBy: string;
}

export const useAssignBadgeToHolder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ azureOID, badgeType, assignedBy }: AssignBadgeParams) => {
            return await badgeHolderApi.apiBadgeHoldersAzureOIDBadgesPost({
                azureOID: azureOID,
                badgeDTO: {
                    type: badgeType,
                    assignedBy: {
                        azureOid: assignedBy
                    },
                    assignedAt: new Date().toISOString(),
                }
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