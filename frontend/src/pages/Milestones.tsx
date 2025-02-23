import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_URL } from '../config';

type Milestone = {
    id: string;
    name: string;
};

const Milestones = () => {
    const navigate = useNavigate();
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container my-5">
            <h1 className="text-center text-4xl font-bold mb-5">Visualizza e Crea Milestones</h1>

            <div className="d-flex justify-content-center mb-4">
                <button
                    onClick={handleAddMilestone}
                    className="btn btn-primary px-4 py-2"
                >
                    Crea Milestone
                </button>
            </div>

            <div className="milestones-list">
                <ul className="list-group">
                    {milestones.map((milestone, index) => (
                        <li key={milestone.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {milestone.name}
                            <span className="badge badge-primary badge-pill">{index + 1}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Milestones;