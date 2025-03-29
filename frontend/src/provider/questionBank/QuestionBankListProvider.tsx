import { QuestionBankDTO } from "@dti-isin/backend-api-client";
import {QuestionBankListContext} from "../../contexts/questionBank/QuestionBankListContext.ts";
import React, {useMemo} from "react";
import {useQuery} from "react-query";
import {questionBankApi} from "../../../config/config.ts";

export const QuestionBankListProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const questionBanksQuery = useQuery<QuestionBankDTO[], Error>({
        queryKey: ["questionBanks"],
        queryFn: async () => (await questionBankApi.apiQuestionBanksGet()).data,
    });

    const value = useMemo(() => ({
        questionBanks: questionBanksQuery.data || [],

        isLoadingQuestionBanks: questionBanksQuery.isLoading,

        errorQuestionBanks: questionBanksQuery.error,

        fetchQuestionBanks: async () => {
            await questionBanksQuery.refetch();
        }
    }), [questionBanksQuery]);

    return (
        <QuestionBankListContext.Provider value={value}>
            {children}
        </QuestionBankListContext.Provider>
    );
}