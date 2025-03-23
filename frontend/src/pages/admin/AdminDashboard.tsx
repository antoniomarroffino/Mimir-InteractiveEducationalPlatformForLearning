import React, {useEffect, useState} from "react";
import {Role} from "@dti-isin/backend-api-client";
import {useAdmin} from "../../hooks/useAdmin.ts";
import {FiAlertTriangle, FiArrowUp, FiMail, FiUserPlus} from "react-icons/fi";

const AdminDashboard = () => {
    const {promoteUser, isLoading, error: errorPromoteUser} = useAdmin();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<Role>(Role.Student);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (errorPromoteUser) {
            setError(errorPromoteUser.message || "Errore durante l'aggiornamento del ruolo");
        }
    }, [errorPromoteUser]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            await promoteUser(email, role);
            setEmail("");
        } catch (err) {
            setError("Errore di connessione o del server: " + err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
                        <FiUserPlus className="inline-block"/>
                        Admin Dashboard
                    </h1>
                    <p className="text-base-content/70">Manage user roles and permissions</p>
                </div>

                <div className="card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-6 border-b pb-4 border-base-200">
                            <FiArrowUp className="text-primary"/>
                            User Role Management
                        </h2>
                        {(error || errorPromoteUser) && (
                            <div className="alert alert-error animate-fade-in-down">
                                <FiAlertTriangle className="flex-shrink-0 w-6 h-6"/>
                                <div className="flex flex-col text-left">
                                    <span className="font-bold">Operazione non riuscita!</span>
                                    <span className="text-sm">{error || errorPromoteUser?.message}</span>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center gap-2">
                                        <FiMail className="text-primary"/>
                                        User Email
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="input input-bordered input-primary w-full focus:ring-2 ring-primary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center gap-2">
                                        <FiUserPlus className="text-primary"/>
                                        Select Role
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered select-primary w-full focus:ring-2 ring-primary"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as Role)}
                                >
                                    <option value={Role.Student}>👨🎓 Student</option>
                                    <option value={Role.Teacher}>👩🏫 Teacher</option>
                                </select>
                            </div>

                            <div className="flex justify-end mt-8 gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmail("");
                                        setError(null);
                                    }}
                                    className="btn btn-ghost"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className={`btn btn-primary px-8 gap-2 ${isLoading ? "loading" : ""}`}
                                    disabled={isLoading}
                                >
                                    {!isLoading && <FiArrowUp className="text-xl"/>}
                                    {isLoading ? "Aggiornamento..." : "Cambia Ruolo"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;