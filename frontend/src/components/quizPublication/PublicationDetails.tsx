import React from 'react';
import { QuizPublicationDTO } from '@dti-isin/backend-api-client';
import { FaCalendar, FaClock, FaTag, FaUserSecret, FaLock, FaLockOpen } from 'react-icons/fa';
import {formatDateTime} from "../../utils/timeUtils.ts";

interface PublicationDetailsProps {
    publication: QuizPublicationDTO;
}

export const PublicationDetails: React.FC<PublicationDetailsProps> = ({ publication }) => {
    return (
        <div className="space-y-6">
            {/* Status Bar */}
            <div className="flex flex-wrap items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                    ${publication.published
                    ? 'bg-success/10 text-success'
                    : 'bg-error/10 text-error'
                }`}
                >
                    {publication.published ? <FaLockOpen /> : <FaLock />}
                    {publication.published ? 'Active Publication' : 'Closed Publication'}
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-base-200 rounded-lg">
                    <FaTag className="text-primary" />
                    <span className="font-mono">{publication.publicationCode}</span>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg
                    ${publication.anonymous
                    ? 'bg-warning/10 text-warning'
                    : 'bg-base-200 text-base-content/70'
                }`}
                >
                    <FaUserSecret />
                    {publication.anonymous ? 'Anonymous Responses' : 'Login Required'}
                </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FaCalendar className="text-primary" />
                    </div>
                    <div>
                        <div className="text-base-content/70">Created</div>
                        <div className="font-medium">{formatDateTime(publication.createdAt)}</div>
                    </div>
                </div>

                {!publication.published && publication.closedAt && (
                    <>
                        <div className="h-px w-8 bg-base-300" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                                <FaClock className="text-error" />
                            </div>
                            <div>
                                <div className="text-base-content/70">Closed</div>
                                <div className="font-medium">{formatDateTime(publication.closedAt)}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};