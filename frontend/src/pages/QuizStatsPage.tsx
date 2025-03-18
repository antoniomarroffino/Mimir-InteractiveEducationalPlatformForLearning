import { useParams } from 'react-router-dom';
import { useQuizPublication } from '../hooks/useQuizPublication';

export const QuizStatsPage = () => {
    const { publicationId } = useParams<{ publicationId: string }>();
    const { publications } = useQuizPublication();

    const publication = publications.find(p => p.id === publicationId);

    if (!publication) {
        return <div>Pubblicazione non trovata</div>;
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
                    <div className="badge badge-success gap-2">
                        {publication.published ? 'Attivo' : 'Disattivato'}
                    </div>
                </div>
            </div>

            {/* Aggiungi qui altre sezioni per le statistiche */}
        </div>
    );
};