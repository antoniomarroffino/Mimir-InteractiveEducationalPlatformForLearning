import { useAuth } from "../../hooks/useAuth.ts";

const StudentDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-base-200">
            {/* Hero Section */}
            <div className="hero py-16 bg-gradient-to-r from-primary to-secondary">
                <div className="hero-content text-center text-neutral-content">
                    <div>
                        <h1 className="text-5xl font-bold mb-2">Dashboard Studente</h1>
                        <p className="text-xl">Benvenuto, {user?.name}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">

                {/* Sezione Partecipa a Quiz */}
                <section className="mb-16">
                    <div className="card bg-primary/10 border border-primary/20 shadow-xl">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title text-3xl text-primary mb-4">
                                Partecipa a un Quiz
                            </h2>
                            <div className="w-full max-w-md">
                                <div className="join w-full">
                                    <input
                                        type="text"
                                        placeholder="Inserisci codice sessione"
                                        className="input input-bordered join-item flex-1"
                                    />
                                    <button className="btn btn-primary join-item">
                                        Unisciti
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sezione Ultimi Risultati */}
                <section>
                    <h2 className="text-3xl font-bold text-primary mb-8 text-center">
                        Ultimi Risultati
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="card bg-base-100 shadow-md">
                                <div className="card-body">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold">Quiz di Matematica</h3>
                                            <p className="text-sm text-base-content/70">Completato il 12/03/2024</p>
                                        </div>
                                        <div className="badge badge-primary">85%</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentDashboard;