import { BadgeHolder } from "@dti-isin/backend-api-client";
import {useQuery} from "react-query";
import {badgeHolderApi} from "../../../config/config.ts";

export const useGetBadgeHolderByAzureOid = (azureOID: string) => {
    return useQuery<BadgeHolder, Error>({
        queryKey: ['badgeHolders', azureOID],
        queryFn: async () => badgeHolderApi.apiBadgeHoldersAzureOIDGet({azureOID})
            .then(result => result.data),
        staleTime: 1000 * 60 * 5,
    })
}