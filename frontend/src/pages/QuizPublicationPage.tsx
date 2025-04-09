import React from 'react';
import {QRCodeSVG} from 'qrcode.react';
import {useQuizPublicationCRUD} from "../hooks/quizPublication/useQuizPublicationCRUD.ts";
import {useNavigate, useParams} from "react-router-dom";
import {FaInfoCircle, FaPowerOff} from 'react-icons/fa';
import {useGetQuizPublicationById} from "../hooks/quizPublication/useGetQuizPublicationById.ts";
import QRCodeModal from "../components/quizPublication/QRCodeModal.tsx";
import ConfirmModal from "../components/quiz/ConfirmModal.tsx";

export const QuizPublicationPage: React.FC = () => {
    const navigate = useNavigate();
    const {publicationId} = useParams<{ publicationId: string }>();
    const {deactivatePublication, isDeactivatingPublication} = useQuizPublicationCRUD();
    const {data: publication, isLoading, error} = useGetQuizPublicationById(publicationId!);

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

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-4rem)] flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error || !publication) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                <div className="alert alert-error shadow-lg max-w-2xl w-full">
                    <FaInfoCircle className="h-6 w-6"/>
                    <span>{error?.message || 'Publication not found'}</span>
                </div>
            </div>
        );
    }

    const baseUrl = import.meta.env.VITE_REDIRECT_URI.replace(/\/+$/, '');
    const fullUrl = `${baseUrl}/quiz/${publication.publicationCode}`;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-base-200 to-base-300">
            <div className="container mx-auto p-4 h-full">
                <div className="bg-base-100 rounded-xl shadow-lg h-[calc(100vh-6rem)]">
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-base-200">
                            <div className="flex justify-between items-center gap-4">
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    <FaInfoCircle className="text-primary"/>
                                    Publication Details
                                </h1>
                                <button
                                    onClick={() => setIsConfirmModalOpen(true)}
                                    className={`btn btn-sm gap-2 ${publication.published ? 'btn-error' : 'btn-success'}`}
                                    disabled={isDeactivatingPublication}
                                >
                                    {isDeactivatingPublication ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <FaPowerOff/>
                                    )}
                                    {publication.published ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="grid md:grid-cols-2 gap-6 h-full">
                                <div className="space-y-6">
                                    <div
                                        className="card bg-gradient-to-br from-primary/10 to-secondary/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="card-body p-6">
                                            <h2 className="card-title text-lg flex items-center gap-2 text-primary">
                                                🎯 Access Code
                                            </h2>
                                            <div className="mt-4 p-4 bg-base-100 rounded-xl shadow-inner">
                                                <div
                                                    className="text-4xl font-mono text-center font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                                    {publication.publicationCode}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="card bg-gradient-to-br from-secondary/10 to-accent/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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
                                                                publication.published
                                                                    ? 'bg-success animate-pulse'
                                                                    : 'bg-error'
                                                            }`}></span>
                                                            {publication.published ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="card bg-gradient-to-br from-accent/10 to-primary/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="card-body p-6">
                                        <h2 className="card-title text-lg flex items-center gap-2 text-accent">
                                            📱 QR Code Access
                                        </h2>
                                        <div className="flex flex-col items-center justify-center gap-4 mt-4">
                                            <button
                                                onClick={() => setIsQRModalOpen(true)}
                                                className="group p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all relative"
                                            >
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 rounded-xl transition-all">
                                                    <span
                                                        className="opacity-0 group-hover:opacity-100 text-white font-medium transition-all">
                                                        Click to enlarge
                                                    </span>
                                                </div>
                                                <QRCodeSVG value={fullUrl} size={200} className="rounded-lg"/>
                                            </button>
                                            <div className="w-full">
                                                <p className="text-sm text-base-content/70 mb-2">Direct access URL:</p>
                                                <div
                                                    className="p-3 bg-base-100 rounded-lg shadow-inner text-xs break-all font-mono">
                                                    {fullUrl}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <QRCodeModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                url={fullUrl}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDeactivate}
                title="Deactivate Publication"
                confirmText={isDeactivatingPublication ? "Deactivating..." : "Deactivate"}
                cancelText="Cancel"
            >
                <p>
                    Are you sure you want to deactivate this quiz publication?
                    This action will prevent students from accessing the quiz.
                </p>
                <div className="alert alert-warning mt-4">
                    <FaInfoCircle/>
                    <span>This action cannot be undone.</span>
                </div>
            </ConfirmModal>
        </div>
    );
};