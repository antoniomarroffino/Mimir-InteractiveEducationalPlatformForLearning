import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const CreateFolder = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        /*
        const fetchProtectedData = async () => {
        if (accounts.length === 0) return;

        try {
            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            });

            const token = response.accessToken;

            console.log("Access token: ", token);

            const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
            const apiEndpoint = backendUrl ? `${backendUrl}/secure/message` : "/secure/message";

            console.log(apiEndpoint);
            console.log(import.meta.env.VITE_REDIRECT_URI);

            const res = await fetch(apiEndpoint, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Errore nella richiesta: ${res.statusText}`);
            }

            const text = await res.text();
            setData(text);
        } catch (err: unknown) {
            if(err instanceof Error) {
                setError(err.message);
            } else {
                setError("Si è verificato un errore sconosciuto");
            }
        }
    };

         */

        try {
            console.log('Invio richiesta POST a:', `${import.meta.env.VITE_BACKEND_URL}/folders`);
            console.log('Payload:', { name });

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/folders`, {
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
            navigate('/folders');
        } catch (error) {
            console.error('Errore dettagliato:', error);
            setLoading(false);
        }
    };
    return (
        <div className="container my-5">
            <h1 className="text-center text-4xl font-bold mb-5">Crea una Nuova Folder</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="folderName" className="h5">Nome della Folder</label>
                    <input
                        type="text"
                        id="folderName"
                        className="form-control"
                        placeholder="Inserisci il nome della folder"
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
                        {loading ? 'Creando...' : 'Crea Folder'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateFolder;