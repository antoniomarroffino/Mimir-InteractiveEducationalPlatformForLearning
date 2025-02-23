import { useEffect, useState } from "react";

// Definizione del tipo Milestone
type Milestone = {
    id: string;  // Può essere stringa o numero, dipende da come gestisci l'ID nel backend
    name: string;
};

const Milestones = () => {
    // Imposta il tipo dell'array come Milestone[]
    const [milestones, setMilestones] = useState<Milestone[]>([]);

    useEffect(() => {
        fetch('/api/milestones')
            .then((response) => response.json())
            .then((data) => setMilestones(data));
    }, []);

    const handleAddMilestone = () => {
        // logica per aggiungere una milestone
    };

    return (
        <div className="text-center">
            <h1 className="text-3xl">Visualizza e Crea Milestones</h1>
            <button
                onClick={handleAddMilestone}
                className="mt-4 p-2 bg-blue-500 text-white"
            >
                Crea Milestone
            </button>
            <ul className="mt-4">
                {milestones.map((milestone, index) => (
                    <li key={index}>{milestone.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Milestones;
