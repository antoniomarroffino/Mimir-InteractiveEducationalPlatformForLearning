import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FoldersContext } from '../contexts/FoldersContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Folders = () => {
    const navigate = useNavigate();
    const { folders, error } = useContext(FoldersContext)!;
    const [expandedFolder, setExpandedFolder] = useState<string | null>(null);

    const handleAddFolder = () => {
        navigate('/create-folder');
    };

    const toggleFolder = (id: string) => {
        setExpandedFolder(expandedFolder === id ? null : id);
    };

    return (
        <div className="container-fluid bg-light min-vh-100 p-0">
            <header className="bg-info-custom text-white py-5">
                <div className="container">
                    <h1 className="display-4">Folders</h1>
                    <p className="lead">Gestisci e monitora le tue folders</p>
                </div>
            </header>

            {/* Se c'è un errore, mostriamo il messaggio, altrimenti la lista delle cartelle */}
            <section className="py-5 shadow-up">
                <div className="container">
                    {error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <div className="row">
                            <div className="col-md-8">
                                <div className="d-flex justify-content-between mb-4">
                                    <div className="d-flex align-items-center gap-3 text-start">
                                        <img className="custom-icon" src="../../public/milestone-icon.png" alt="Folder Icon"/>
                                        <h3 className="text-primary text-start">Le tue Cartelle</h3>
                                    </div>
                                    <button onClick={handleAddFolder} className="btn btn-primary px-4 py-2">
                                        <i className="fas fa-plus me-2"></i>
                                        Crea Cartella
                                    </button>
                                </div>

                                {folders.map((folder) => (
                                    <div key={folder.id} className="mb-4">
                                        <div className="card bg-primary bg-opacity-50 shadow-sm">
                                            <div className="card-body">
                                                <div
                                                    className="d-flex justify-content-between align-items-center cursor-pointer"
                                                    onClick={() => toggleFolder(folder.id)}
                                                >
                                                    <h5 className="card-title text-white mb-0">
                                                        {folder.name}
                                                    </h5>
                                                    <i className={`fas fa-chevron-${expandedFolder === folder.id ? 'up' : 'down'} text-white`}></i>
                                                </div>
                                                {expandedFolder === folder.id && (
                                                    <div className="mt-3">
                                                        <div className="bg-white p-3 rounded">
                                                            <h6 className="text-primary">Sotto-cartella</h6>
                                                            {folder.subFolders?.length ? (
                                                                <ul className="list-group list-group-flush">
                                                                    {folder.subFolders.map(sub => (
                                                                        <li key={sub.id} className="list-group-item">
                                                                            {sub.name}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p className="text-muted mb-0">
                                                                    Nessuna sotto-cartella presente
                                                                </p>
                                                            )}
                                                            <button className="btn btn-outline-primary mt-3">
                                                                <i className="fas fa-plus me-2"></i>
                                                                Aggiungi sotto-cartella
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Folders;
