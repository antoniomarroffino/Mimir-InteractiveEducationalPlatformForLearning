import React from 'react';
import { QuizPublicationDTO } from '@dti-isin/backend-api-client';
import {
    BsInfoCircle,
    BsCalendar,
    BsClock,
    BsTagsFill,
    BsShieldLock,
    BsCheckCircle
} from 'react-icons/bs';
import { motion } from 'framer-motion';

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
            hour12: false
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

            return `${diffDays} days, ${diffHours} hrs, ${diffMinutes} mins`;
        }
        return 'Ongoing';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-lg border border-base-200"
        >
            <div className="flex items-center gap-3 mb-6 border-b border-base-content/10 pb-3">
                <BsInfoCircle className="text-primary text-2xl" />
                <h2 className="text-xl font-bold text-base-content/90">Publication Details</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-base-100 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                            <BsCalendar className="text-primary text-lg" />
                            <span className="font-medium text-base-content/70">Creation Date</span>
                        </div>
                        <span className="text-base-content/90 font-semibold">
                            {formatDate(publication.createdAt)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center bg-base-100 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                            <BsTagsFill className="text-primary text-lg" />
                            <span className="font-medium text-base-content/70">Publication Code</span>
                        </div>
                        <span className="text-primary font-bold tracking-wider">
                            {publication.publicationCode}
                        </span>
                    </div>

                    <div className="flex justify-between items-center bg-base-100 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                            <BsCheckCircle className={`text-lg ${publication.published ? 'text-success' : 'text-error'}`} />
                            <span className="font-medium text-base-content/70">Status</span>
                        </div>
                        <span
                            className={`
                                badge 
                                ${publication.published ? 'badge-success' : 'badge-error'}
                                font-semibold
                            `}
                        >
                            {publication.published ? 'Active' : 'Closed'}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {!publication.published && publication.closedAt && (
                        <>
                            <div className="flex justify-between items-center bg-base-100 p-3 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <BsClock className="text-primary text-lg" />
                                    <span className="font-medium text-base-content/70">Closure Date</span>
                                </div>
                                <span className="text-base-content/90 font-semibold">
                                    {formatDate(publication.closedAt)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-base-100 p-3 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <BsClock className="text-primary text-lg" />
                                    <span className="font-medium text-base-content/70">Publication Duration</span>
                                </div>
                                <span className="text-base-content/70 font-medium">
                                    {calculateDuration()}
                                </span>
                            </div>
                        </>
                    )}

                    <div className="flex justify-between items-center bg-base-100 p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                            <BsShieldLock className="text-primary text-lg" />
                            <span className="font-medium text-base-content/70">Visibility Mode</span>
                        </div>
                        <span
                            className={`
                                badge 
                                ${publication.anonymous ? 'badge-secondary' : 'badge-primary'}
                                font-semibold
                            `}
                        >
                            {publication.anonymous ? 'Anonymous' : 'Identified'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};