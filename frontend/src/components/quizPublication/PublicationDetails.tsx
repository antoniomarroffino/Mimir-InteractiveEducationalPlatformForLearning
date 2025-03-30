import React from 'react';
import { QuizPublicationDTO } from '@dti-isin/backend-api-client';
import { BsInfoCircle, BsCalendar, BsClock } from 'react-icons/bs';

interface PublicationDetailsProps {
    publication: QuizPublicationDTO;
}

export const PublicationDetails: React.FC<PublicationDetailsProps> = ({ publication }) => {
    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDuration = () => {
        if (publication.createdAt && publication.closedAt) {
            const start = new Date(publication.createdAt);
            const end = new Date(publication.closedAt);
            const diffMs = end.getTime() - start.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            return `${diffDays} giorni, ${diffHours} ore, ${diffMinutes} minuti`;
        }
        return 'In corso';
    };

    return (
        <div className="p-6 bg-base-100 rounded-xl shadow-md">
            <div className="flex items-center gap-3 mb-4">
                <BsInfoCircle className="text-primary text-2xl" />
                <h2 className="text-xl font-semibold">Dettagli Pubblicazione</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center gap-2">
                            <BsCalendar className="text-primary" /> Data Creazione:
                        </span>
                        <span className="text-base-content/70">
                            {formatDate(publication.createdAt)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-medium">Codice Pubblicazione:</span>
                        <span className="text-primary font-bold">
                            {publication.publicationCode}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-medium">Stato:</span>
                        <span
                            className={`
                                badge 
                                ${publication.published
                                ? 'badge-success'
                                : 'badge-error'}
                            `}
                        >
                            {publication.published ? 'Attivo' : 'Chiuso'}
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    {!publication.published && publication.closedAt && (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="font-medium flex items-center gap-2">
                                    <BsClock className="text-primary" /> Data Chiusura:
                                </span>
                                <span className="text-base-content/70">
                                    {formatDate(publication.closedAt)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Durata Pubblicazione:</span>
                                <span className="text-base-content/70">
                                    {calculateDuration()}
                                </span>
                            </div>
                        </>
                    )}

                    <div className="flex justify-between items-center">
                        <span className="font-medium">Modalità:</span>
                        <span
                            className={`
                                badge 
                                ${publication.anonymous ? 'badge-secondary' : 'badge-primary'}
                            `}
                        >
                            {publication.anonymous ? 'Anonimo' : 'Nominativo'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};