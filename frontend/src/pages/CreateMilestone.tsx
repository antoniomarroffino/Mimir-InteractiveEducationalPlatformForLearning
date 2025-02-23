import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { API_URL } from '../config';

const CreateMilestone = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Invio richiesta POST a:', `${API_URL}/api/milestones`);
            console.log('Payload:', { name });

            const response = await fetch(`${API_URL}/api/milestones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Risposta del server:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Risposta del server:', data);

            setLoading(false);
            navigate('/milestones');
        } catch (error) {
            console.error('Errore dettagliato:', error);
            setLoading(false);
        }
    };
    return (
        <div className="container my-5">
            <h1 className="text-center text-4xl font-bold mb-5">Crea una Nuova Milestone</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="milestoneName" className="h5">Nome della Milestone</label>
                    <input
                        type="text"
                        id="milestoneName"
                        className="form-control"
                        placeholder="Inserisci il nome della milestone"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="d-flex justify-content-center mt-4">
                    <button
                        type="submit"
                        className="btn btn-success px-4 py-2"
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : 'Crea Milestone'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateMilestone;