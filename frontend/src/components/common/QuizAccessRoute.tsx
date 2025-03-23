import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth.ts";
import {useQuizPublicationVerification} from "../../hooks/useQuizPublicationVerification.ts";
import QuizScreen from "../../pages/QuizScreen.tsx";
import {useQuizRetrieve} from "../../hooks/useQuizRetrieve.ts";

export const QuizAccessRoute: React.FC = () => {
    const {accessCode} = useParams<{ accessCode: string }>();
    const {user} = useAuth();
    const {getPublicationByCode} = useQuizPublicationVerification();
    const {retrieveQuiz} = useQuizRetrieve();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkPublicationAccess = async () => {
            if (!accessCode) {
                setError('Codice di accesso non valido');
                setIsLoading(false);
                return;
            }

            try {
                const fetchedPublication = await getPublicationByCode(accessCode);

                if (!fetchedPublication) {
                    setError('Pubblicazione non trovata');
                    setIsLoading(false);
                    return;
                }
                await retrieveQuiz(fetchedPublication);

            } catch (err) {
                console.error('Errore nel recupero della pubblicazione:', err);
                setError('Impossibile verificare l\'accesso al quiz');
            } finally {
                setIsLoading(false);
            }
        };

        checkPublicationAccess();
    }, [accessCode, user, getPublicationByCode]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error shadow-lg m-4">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                         viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return <QuizScreen/>;
};