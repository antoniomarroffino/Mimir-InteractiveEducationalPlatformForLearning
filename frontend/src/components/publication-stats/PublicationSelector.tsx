import React from "react";
import {QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {formatDateTime} from "../../utils/timeUtils.ts";

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
    return (
        <div className="relative w-full">
            <select
                className="select select-bordered w-full pr-10
                           bg-base-100 hover:bg-base-200 text-base transition-colors"
                value={selectedPublication?.id || 'none'}
                onChange={(e) => {
                    if (e.target.value === 'none') {
                        onPublicationChange(null);
                        return;
                    }
                    const publication = publications.find(p => p.id === e.target.value);
                    onPublicationChange(publication || null);
                }}
            >
                <option value="none">No publication selected</option>
                {publications.map(publication => (
                    <option key={publication.id} value={publication.id}>
                        {formatDateTime(publication.createdAt)}
                        {publication.published ? ' (Active)' : ' (Closed)'}
                    </option>
                ))}
            </select>
        </div>
    );
};