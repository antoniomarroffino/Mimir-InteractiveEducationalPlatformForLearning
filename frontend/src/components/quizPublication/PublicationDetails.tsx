import React from 'react';
import { QuizPublicationDTO } from '@dti-isin/backend-api-client';
import { BsInfoCircle } from 'react-icons/bs';

interface PublicationDetailsProps {
    publication: QuizPublicationDTO;
}

export const PublicationDetails: React.FC<PublicationDetailsProps> = ({ publication }) => {
    return (
        <div className="p-6 bg-base-100 rounded-xl shadow-md">
            <div className="flex items-center gap-3 mb-4">
                <BsInfoCircle className="text-primary text-2xl" />
                <h2 className="text-xl font-semibold">Dettagli Pubblicazione</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium">ID Pubblicazione:</span>
                        <span className="text-base-content/70">{publication.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Codice Pubblicazione:</span>
                        <span className="text-primary font-bold">{publication.publicationCode}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium">Corso ID:</span>
                        <span className="text-base-content/70">{publication.courseId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Cartella ID:</span>
                        <span className="text-base-content/70">{publication.folderId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Quiz ID:</span>
                        <span className="text-base-content/70">{publication.quizId}</span>
                    </div>
                </div>

                <div className="col-span-full space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Stato:</span>
                        <span
                            className={`
                                badge 
                                ${publication.published ? 'badge-success' : 'badge-warning'}
                            `}
                        >
                            {publication.published ? 'Pubblicato' : 'Non Pubblicato'}
                        </span>
                    </div>
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