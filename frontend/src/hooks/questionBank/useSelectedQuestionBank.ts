import { QuestionBankDTO } from "@dti-isin/backend-api-client";
import {useQuery} from "react-query";
import {questionBankApi} from "../../../config/config.ts";

export const useGetQuestionBankById = (id: string) => {
    return useQuery<QuestionBankDTO, Error>({
        queryKey: ['questionBanks', id],
        queryFn: async () => questionBankApi.apiQuestionBanksIdGet({id})
            .then(response => response.data as QuestionBankDTO),
        staleTime: 1000 * 60 * 5
    })
}