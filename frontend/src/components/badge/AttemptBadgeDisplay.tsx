import React from 'react';
import {FaTrophy} from 'react-icons/fa';
import {BadgeDTO} from '@dti-isin/backend-api-client';

interface AttemptBadgeDisplayProps {
    badge: BadgeDTO;
}

export const AttemptBadgeDisplay: React.FC<AttemptBadgeDisplayProps> = ({badge}) => {
    return (
        <div className="bg-gradient-to-r from-warning/10 to-warning/5 rounded-xl p-4 border border-warning/20">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <FaTrophy className="text-5xl text-warning"
                              style={{filter: 'drop-shadow(0 0 8px rgb(234 179 8))'}}/>
                    <div className="absolute -top-2 -right-2">
                        <div className="w-4 h-4 bg-success rounded-full animate-ping opacity-50"/>
                        <div className="w-4 h-4 bg-success rounded-full absolute top-0"/>
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-warning">
                        Best Attempt Badge Earned! 🎉
                    </h3>
                    <p className="text-sm text-base-content/70">
                        Congratulations! This attempt has been recognized for outstanding performance.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-base-content/60">
                        <span>Awarded on {new Date(badge.assignedAt!).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>by {badge.assignedBy.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};