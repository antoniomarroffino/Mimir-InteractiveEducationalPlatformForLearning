import React from "react";
import {QuizPublicationDTO} from "@dti-isin/backend-api-client";

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
        <div className="p-4 bg-base-200">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Select Publication</span>
                </label>
                <select
                    className="select select-primary"
                    value={selectedPublication?.id || ''}
                    onChange={(e) => {
                        const publication = publications.find(p => p.id === e.target.value);
                        onPublicationChange(publication || null);
                    }}
                >
                    {publications.map(publication => {
                        const createdDate = publication.createdAt
                            ? new Date(publication.createdAt).toLocaleDateString()
                            : 'Unavailable Date';

                        return (
                            <option key={publication.id} value={publication.id}>
                                {createdDate} - Code: {publication.publicationCode}
                                {publication.anonymous ? ' (Anonymous)' : ''}
                                {publication.published ? ' (Active)' : ' (Closed)'}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
};