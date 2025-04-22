import React from "react";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";
import { FaCalendar, FaLock, FaLockOpen, FaUserSecret, FaChevronDown } from 'react-icons/fa';

interface PublicationSelectorProps {
    publications: QuizPublicationDTO[];
    selectedPublication: QuizPublicationDTO | null;
    onPublicationChange: (publication: QuizPublicationDTO | null) => void;
}

export const PublicationSelector: React.FC<PublicationSelectorProps> = ({
                                                                            publications,
                                                                            selectedPublication,
                                                                            onPublicationChange
                                                                        }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-base-content/70">
                <FaCalendar className="text-primary" />
                <span className="text-sm font-medium">Select Publication Version</span>
            </div>

            <div className="relative">
                <select
                    className="select select-bordered w-full pr-10 appearance-none bg-base-100 hover:bg-base-200 text-sm transition-colors"
                    value={selectedPublication?.id || ''}
                    onChange={(e) => {
                        const publication = publications.find(p => p.id === e.target.value);
                        onPublicationChange(publication || null);
                    }}
                >
                    {publications.map(publication => (
                        <option key={publication.id} value={publication.id}>
                            {formatDate(publication.createdAt)} - {publication.publicationCode}
                        </option>
                    ))}
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-base-content/50">
                    <FaChevronDown />
                </div>
            </div>

            {selectedPublication && (
                <div className="flex items-center gap-4 text-sm text-base-content/70">
                    <div className="flex items-center gap-1">
                        {selectedPublication.published ? (
                            <>
                                <FaLockOpen className="text-success" />
                                <span className="text-success">Active</span>
                            </>
                        ) : (
                            <>
                                <FaLock className="text-error" />
                                <span className="text-error">Closed</span>
                            </>
                        )}
                    </div>

                    {selectedPublication.anonymous && (
                        <div className="flex items-center gap-1">
                            <FaUserSecret className="text-warning" />
                            <span className="text-warning">Anonymous</span>
                        </div>
                    )}

                    <div className="text-xs font-mono bg-base-200 px-2 py-1 rounded">
                        Code: {selectedPublication.publicationCode}
                    </div>
                </div>
            )}
        </div>
    );
};