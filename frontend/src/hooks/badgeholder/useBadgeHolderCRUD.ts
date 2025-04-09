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

    const assignBadgeMutation = useMutation({
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['badgeHolders'] });
        },
        onError: (error) => {
            console.error('Failed to assign badge:', error);
            throw error;
        }
    });

    return {
        assignBadgeToHolder: assignBadgeMutation.mutate,
        isAssigningBadge: assignBadgeMutation.isLoading
    };
};