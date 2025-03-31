import React from 'react';
import {QRCodeSVG} from 'qrcode.react';
import {useQuizPublicationCRUD} from "../hooks/quizPublication/useQuizPublicationCRUD.ts";
import {useParams} from "react-router-dom";
import {FaInfoCircle, FaPowerOff, FaQrcode} from 'react-icons/fa';
import {useGetQuizPublicationById} from "../hooks/quizPublication/useGetQuizPublicationById.ts";

export const QuizPublicationPage: React.FC = () => {
    const {publicationId} = useParams<{ publicationId: string }>();
    const {
        deactivatePublication,
        isDeactivatingPublication,
    } = useQuizPublicationCRUD();
    const {data: publication, isLoading: isLoadingPublication, error: errorGetPublication} = useGetQuizPublicationById(publicationId!);

    //TODO: rivedere
    const handleTogglePublication = async () => {
        if (!publication) return;
        try {
            await deactivatePublication(publicationId!);
        } catch (error) {
            console.error("Errore nell'aggiornamento:", error);
        }
    };

    if (isLoadingPublication) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (errorGetPublication || !publication) {
        return (
            <div className="alert alert-error shadow-lg m-4">
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{errorGetPublication?.message || 'Pubblicazione non trovata'}</span>
                </div>
            </div>
        );
    }
    const baseUrl = import.meta.env.VITE_REDIRECT_URI.replace(/\/+$/, '');
    const fullUrl = `${baseUrl}/quiz/${publication.publicationCode}`;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FaInfoCircle className="text-primary"/>
                    Statistiche del Quiz
                </h1>

                <button
                    onClick={handleTogglePublication}
                    className={`btn gap-2 ${publication.published
                        ? 'btn-error'
                        : 'btn-success'}
                        md:mt-0 mt-4`}
                    disabled={isDeactivatingPublication}
                >
                    {isDeactivatingPublication ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <FaPowerOff/>
                    )}
                    {publication.published ? 'Disattiva Pubblicazione' : 'Attiva Pubblicazione'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Sezione Principale */}
                <div className="space-y-6">
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title text-xl">
                                Codice di Accesso
                            </h2>
                            <div className="text-5xl font-mono my-4 text-center font-bold text-primary">
                                {publication.publicationCode}
                            </div>
                        </div>
                    </div>

                    {/* Dettagli Pubblicazione (se necessario) */}
                    {/* Dettagli Pubblicazione */}
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title text-xl flex items-center gap-2 mb-4">
                                <FaInfoCircle className="text-secondary"/>
                                Informazioni Pubblicazione
                            </h2>

                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <span>Stato pubblicazione:</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-semibold ${publication.published
                                            ? 'text-success'
                                            : 'text-error'}`}
                                        >
                                            {publication.published ? 'Attivo' : 'Disattivato'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sezione QR Code */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-xl flex items-center gap-2">
                            <FaQrcode className="text-accent"/>
                            Accesso via QR Code
                        </h2>
                        <div className="text-center">
                            <div className="my-4 p-2 bg-white rounded-lg inline-block">
                                <QRCodeSVG
                                    value={fullUrl}
                                    size={256}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-neutral-500 mb-2">
                                    URL per l'accesso diretto:
                                </p>
                                <p className="text-xs break-all p-2 bg-base-200 rounded">
                                    {fullUrl}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};