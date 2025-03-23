import React, {useState} from 'react';
import {useAuth} from "../../hooks/useAuth.ts";
import {FiHash} from "react-icons/fi";
import {useNavigate} from 'react-router-dom';
import {useQuizPublicationVerification} from '../../hooks/useQuizPublicationVerification';

const QuizSessionComponent = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const {getPublicationByCode} = useQuizPublicationVerification();
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleJoin = async () => {
        setErrorMessage('');

        const trimmedCode = code.trim();
        if (trimmedCode === '') {
            setErrorMessage('Inserisci un codice valido');
            return;
        }

        try {
            setIsLoading(true);
            const publication = await getPublicationByCode(trimmedCode);

            if (!publication) {
                handleInvalidCode();
                return;
            }

            navigate(`/quiz/${trimmedCode}`);
        } catch (error) {
            handleVerificationError(error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleInvalidCode = () => {
        setCode('');
        setErrorMessage('Codice non valido. Riprova.');
    };

    const handleVerificationError = (error: unknown) => {
        setCode('');
        setErrorMessage('Errore durante la verifica del codice. Riprova.');
        console.error('Error verifying code:', error);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        setErrorMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleJoin();
        }
    };

    return (
        <section className="w-full max-w-md mx-auto">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <FiHash className="text-4xl text-primary"/>
                    </div>

                    <h2 className="card-title text-2xl text-center">Partecipa a un quiz</h2>
                    <p className="text-base-content/70 mb-6">Inserisci il codice:</p>

                    <div className="w-full">
                        <div className="join w-full">
                            <input
                                type="text"
                                placeholder="Codice sessione"
                                className="input input-bordered join-item flex-1"
                                value={code}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />
                            <button
                                className="btn btn-primary join-item"
                                onClick={handleJoin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : user ? "Unisciti" : "Accedi"}
                            </button>
                        </div>
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-error mt-4">{errorMessage}</p>
                    )}

                    {!user && (
                        <p className="text-sm text-base-content/70 mt-4">
                            Effettua il login per accedere a tutte le funzionalità
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default QuizSessionComponent;