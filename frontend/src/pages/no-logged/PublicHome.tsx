import {Link} from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth.ts';
import {QuizSessionComponent} from "../../components/common/QuizSessionComponent.tsx";
import {QuizHistorySection} from "../../components/quiz-results/QuizHistorySection.tsx";

const PublicHome = () => {
    const {user} = useAuth();

    return (
        <div className="min-h-screen bg-base-200">
            {/* Hero Section */}
            <div className="hero py-16 bg-gradient-to-r from-primary to-secondary">
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-bold mb-4">Piattaforma Didattica Interattiva</h1>
                        <p className="text-xl mb-6">Partecipa alle sessioni quiz e migliora il tuo apprendimento</p>
                        {!user && (
                            <Link to="/login" className="btn btn-accent btn-lg">
                                Accedi per iniziare
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Sezione Partecipa a Quiz */}
            <QuizSessionComponent/>

            {user && <QuizHistorySection />}
        </div>
    );
};

export default PublicHome;