import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useQuizPublicationCRUD } from "../hooks/quizPublication/useQuizPublicationCRUD.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useGetQuizPublicationById } from "../hooks/quizPublication/useGetQuizPublicationById.ts";
import QRCodeModal from "../components/quizPublication/QRCodeModal.tsx";
import { QuizPublicationHeader } from "../components/quizPublication/QuizPublicationHeader.tsx";
import { Spinner } from "../components/common/Spinner.tsx";
import { ErrorAlert } from "../components/common/ErrorAlert.tsx";
import { ConfirmUnpublishPopup } from "../components/quizPublication/ConfirmUnpublishPopup.tsx";
import { motion } from 'framer-motion';

export const QuizPublicationPage: React.FC = () => {
    const navigate = useNavigate();
    const { publicationId } = useParams<{ publicationId: string }>();
    const { deactivatePublication, isDeactivatingPublication } = useQuizPublicationCRUD();
    const { data: publication, isLoading, error } = useGetQuizPublicationById(publicationId!);

    const [isQRModalOpen, setIsQRModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);

    const handleDeactivate = async () => {
        if (!publication) return;
        try {
            await deactivatePublication(publicationId!);
            navigate('/');
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    if (isLoading) return <Spinner />;

    if (error || !publication) {
        return (
            <div className="max-w-3xl mx-auto px-4">
                <ErrorAlert
                    title="Publication not found"
                    message={error?.message}
                />
                <div className="text-center mt-4">
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/')}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const baseUrl = import.meta.env.VITE_REDIRECT_URI.replace(/\/+$/, '');
    const fullUrl = `${baseUrl}/quiz/${publication.publicationCode}`;

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto space-y-8">
                <QuizPublicationHeader
                    publication={publication}
                    onDeactivate={handleDeactivate}
                    isDeactivating={isDeactivatingPublication}
                    onOpenConfirmModal={() => setIsConfirmModalOpen(true)}
                />

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="card-body p-6">
                                <h2 className="card-title text-lg flex items-center gap-2 text-primary">
                                    🎯 Access Code
                                </h2>
                                <div className="mt-4 p-4 bg-base-100 rounded-xl shadow-inner">
                                    <div className="text-4xl font-mono text-center font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        {publication.publicationCode}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-secondary/10 to-accent/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="card-body p-6">
                                <h2 className="card-title text-lg flex items-center gap-2 text-secondary">
                                    🎮 Publication Status
                                </h2>
                                <div className="mt-4 p-4 bg-base-100 rounded-xl shadow-inner">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Current Status</span>
                                        <div className={`px-4 py-2 rounded-full ${
                                            publication.published
                                                ? 'bg-success/20 text-success-content'
                                                : 'bg-error/20 text-error-content'
                                        }`}>
                                            <span className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${
                                                    publication.published ? 'bg-success animate-pulse' : 'bg-error'
                                                }`} />
                                                {publication.published ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="card bg-gradient-to-br from-accent/10 to-primary/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="card-body p-6">
                                <h2 className="card-title text-lg flex items-center gap-2 text-accent">
                                    📱 QR Code Access
                                </h2>
                                <div className="flex flex-col items-center justify-center gap-4 mt-4">
                                    <button
                                        onClick={() => setIsQRModalOpen(true)}
                                        className="group p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all relative"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 rounded-xl transition-all">
                                            <span className="opacity-0 group-hover:opacity-100 text-white font-medium transition-all">
                                                Click to enlarge
                                            </span>
                                        </div>
                                        <QRCodeSVG value={fullUrl} size={200} className="rounded-lg" />
                                    </button>
                                    <div className="w-full">
                                        <p className="text-sm text-base-content/70 mb-2">Direct access URL:</p>
                                        <div className="p-3 bg-base-100 rounded-lg shadow-inner text-xs break-all font-mono">
                                            {fullUrl}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <QRCodeModal
                    isOpen={isQRModalOpen}
                    onClose={() => setIsQRModalOpen(false)}
                    url={fullUrl}
                />

                <ConfirmUnpublishPopup
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleDeactivate}
                    isLoading={isDeactivatingPublication}
                />
            </div>
        </motion.section>
    );
};
