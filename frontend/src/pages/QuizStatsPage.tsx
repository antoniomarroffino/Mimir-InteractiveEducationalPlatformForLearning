import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {QuizPublicationDTO} from '@dti-isin/backend-api-client';
import {useQuizPublicationList} from "../hooks/useQuizPublicationList.ts";
import {useQuizPublicationVerification} from "../hooks/useQuizPublicationVerification.ts";

export const QuizStatsPage = () => {
    const {publicationId} = useParams<{ publicationId: string }>();
    const {publications} = useQuizPublicationList();
    const {getPublicationByCode} = useQuizPublicationVerification();

    const [publication, setPublication] = useState<QuizPublicationDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPublication = async () => {
            try {
                const foundPublication = publications.find(p => p.id === publicationId);

                if (foundPublication) {
                    setPublication(foundPublication);
                    setIsLoading(false);
                    return;
                }

                if (foundPublication!.publicationCode) {
                    const fetchedPublication = await getPublicationByCode(foundPublication!.publicationCode);

                    if (fetchedPublication) {
                        setPublication(fetchedPublication);
                    } else {
                        setError('Pubblicazione non trovata');
                    }
                } else {
                    setError('ID pubblicazione non valido');
                }
            } catch (err) {
                console.error('Errore nel recupero della pubblicazione:', err);
                setError('Impossibile recuperare i dettagli della pubblicazione');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublication();
    }, [publicationId, publications, getPublicationByCode]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error || !publication) {
        return (
            <div className="alert alert-error shadow-lg m-4">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                         viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{error || 'Pubblicazione non trovata'}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Statistiche del quiz</h1>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Codice di accesso</h2>
                    <div className="text-4xl font-mono my-4">
                        {publication.publicationCode}
                    </div>
                    <div className={`badge ${publication.published ? 'badge-success' : 'badge-warning'} gap-2`}>
                        {publication.published ? 'Attivo' : 'Disattivato'}
                    </div>
                </div>
            </div>

            {/* Sezioni aggiuntive per le statistiche */}
            <div className="card bg-base-100 shadow-xl mt-4">
                <div className="card-body">
                    <h2 className="card-title">Dettagli Pubblicazione</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>ID Corso:</strong> {publication.courseId}
                        </div>
                        <div>
                            <strong>ID Cartella:</strong> {publication.folderId}
                        </div>
                        <div>
                            <strong>ID Quiz:</strong> {publication.quizId}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};