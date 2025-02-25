import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_URL } from '../config';

type Milestone = {
    id: string;
    name: string;
    description?: string;
    subMilestones?: Milestone[];
};

const Milestones = () => {
    const navigate = useNavigate();
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

    useEffect(() => {
        const fetchMilestones = async () => {
            try {
                const response = await fetch(`${API_URL}/api/milestones`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMilestones(data);
            } catch (error) {
                console.error('Errore nel caricamento delle milestone:', error);
                setError('Errore nel caricamento delle milestone');
            }
        };

        fetchMilestones();
    }, []);

    const handleAddMilestone = () => {
        navigate('/create-milestone');
    };

    const toggleMilestone = (id: string) => {
        setExpandedMilestone(expandedMilestone === id ? null : id);
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container-fluid bg-light min-vh-100 p-0">
            <header className="bg-info-custom text-white py-5">
                <div className="container">
                    <h1 className="display-4">Milestones</h1>
                    <p className="lead">Gestisci e monitora le tue milestones</p>
                </div>
            </header>

            <section className="py-5 shadow-up">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="d-flex justify-content-between mb-4">
                                <div className="d-flex align-items-center gap-3 text-start">
                                    <img className="custom-icon" src="../../public/milestone-icon.png" alt="Milestone Icon"/>
                                    <h3 className="text-primary text-start">Le tue Milestone</h3>
                                </div>

                                <button
                                    onClick={handleAddMilestone}
                                    className="btn btn-primary px-4 py-2"
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Crea Milestone
                                </button>
                            </div>

                            {milestones.map((milestone) => (
                                <div key={milestone.id} className="mb-4">
                                    <div className="card bg-primary bg-opacity-50 shadow-sm">
                                        <div className="card-body">
                                            <div
                                                className="d-flex justify-content-between align-items-center cursor-pointer"
                                                onClick={() => toggleMilestone(milestone.id)}
                                            >
                                                <h5 className="card-title text-white mb-0">
                                                    {milestone.name}
                                                </h5>
                                                <i className={`fas fa-chevron-${expandedMilestone === milestone.id ? 'up' : 'down'} text-white`}></i>
                                            </div>

                                            {expandedMilestone === milestone.id && (
                                                <div className="mt-3">
                                                    <div className="bg-white p-3 rounded">
                                                        <h6 className="text-primary">Sotto-milestone</h6>
                                                        {milestone.subMilestones?.length ? (
                                                            <ul className="list-group list-group-flush">
                                                                {milestone.subMilestones.map(sub => (
                                                                    <li key={sub.id} className="list-group-item">
                                                                        {sub.name}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-muted mb-0">
                                                                Nessuna sotto-milestone presente
                                                            </p>
                                                        )}
                                                        <button className="btn btn-outline-primary mt-3">
                                                            <i className="fas fa-plus me-2"></i>
                                                            Aggiungi sotto-milestone
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-md-4">
                            <div className="card bg-white shadow-sm">
                                <div className="card-body">
                                    <h4 className="text-primary mb-4">Crea un Corso</h4>
                                    <p className="text-muted mb-4">
                                        Crea un nuovo corso per ordinare le milestones
                                    </p>
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={() => navigate('/create-course')}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Nuovo Corso
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Milestones;