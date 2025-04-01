import React from 'react';
import {LoadingSpinner} from '../components/common/LoadingSpinner.tsx';
import {useParams} from "react-router-dom";
import {useGetQuizPublicationByCode} from "../hooks/quizPublication/useGetQuizPublicationByCode.ts";
import QuizPreStart from "../components/QuizPreStart.tsx";

export const QuizScreen: React.FC = () => {
    const {accessCode} = useParams();
    const {data: publication, isLoading: isLoadingPublication, error: errorGetPublication} = useGetQuizPublicationByCode(accessCode!);

    if (errorGetPublication) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="alert alert-error shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6"
                             fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>Error fetching quiz: {errorGetPublication.message}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!publication || isLoadingPublication) {
        return <LoadingSpinner/>;
    }

    return (
        <QuizPreStart publication={publication} />
    );
};

export default QuizScreen;