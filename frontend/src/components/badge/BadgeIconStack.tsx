import React from 'react';
import {BadgeDTO} from '@dti-isin/backend-api-client';
import {BadgeIconCircle} from './BadgeIconCircle';

interface Props {
    badges: BadgeDTO[];
    formatDate: (date?: string) => string;
}

export const BadgeIconStack: React.FC<Props> = ({badges, formatDate}) => {
    return (
        <div className="relative h-32 flex items-center justify-center">
            {badges.map((badge, index) => (
                <BadgeIconCircle
                    key={index}
                    badge={badge}
                    index={index}
                    total={badges.length}
                    formatDate={formatDate}
                />
            ))}
        </div>
    );
};
