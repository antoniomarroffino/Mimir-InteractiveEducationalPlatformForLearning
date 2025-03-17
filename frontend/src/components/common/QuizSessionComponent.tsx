import { useAuth } from "../../hooks/useAuth.ts";
import { FiHash } from "react-icons/fi";


const QuizSessionComponent = () => {
    const { user } = useAuth();

    return (
        <section className="w-full max-w-md mx-auto">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <FiHash className="text-4xl text-primary" />
                    </div>

                    <h2 className="card-title text-2xl text-center">Partecipa a un quiz</h2>
                    <p className="text-base-content/70 mb-6">Inserisci il codice:</p>

                    <div className="w-full">
                        <div className="join w-full">
                            <input
                                type="text"
                                placeholder="Codice sessione"
                                className="input input-bordered join-item flex-1"
                            />
                            <button
                                className="btn btn-primary join-item"
                            >
                                {user ? "Unisciti" : "Accedi"}
                            </button>
                        </div>
                    </div>

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