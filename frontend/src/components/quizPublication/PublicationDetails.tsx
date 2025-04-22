import React from 'react';
import { QuizPublicationDTO } from '@dti-isin/backend-api-client';
import { FaCalendar, FaClock, FaTag, FaUserSecret, FaLock, FaLockOpen } from 'react-icons/fa';

interface PublicationDetailsProps {
    publication: QuizPublicationDTO;
}

export const PublicationDetails: React.FC<PublicationDetailsProps> = ({ publication }) => {
    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 bg-base-100 p-4 rounded-xl shadow-sm">
                <div className="flex-1 flex items-center gap-2">
                    <FaTag className="text-primary" />
                    <span className="font-mono text-sm">{publication.publicationCode}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    publication.published
                        ? 'bg-success/20 text-success'
                        : 'bg-error/20 text-error'
                }`}>
                    {publication.published ? <FaLockOpen /> : <FaLock />}
                    <span className="text-sm font-medium">
                        {publication.published ? 'Active' : 'Closed'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-base-100 p-3 rounded-lg">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-base-content/70 mb-1">
                        <FaCalendar className="text-primary" />
                        <span>Created</span>
                    </div>
                    <div className="text-sm font-medium">
                        {formatDate(publication.createdAt)}
                    </div>
                </div>
                {!publication.published && publication.closedAt && (
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-base-content/70 mb-1">
                            <FaClock className="text-primary" />
                            <span>Closed</span>
                        </div>
                        <div className="text-sm font-medium">
                            {formatDate(publication.closedAt)}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 bg-base-100 p-3 rounded-lg">
                <div className="flex-1 flex items-center gap-2">
                    <FaUserSecret className={publication.anonymous ? 'text-warning' : 'text-base-content/50'} />
                    <span className="text-sm">
                        {publication.anonymous ? 'Anonymous' : 'Identified'} Responses
                    </span>
                </div>
            </div>
        </div>
    );
};