import { Link } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMail, FiKey, FiBook } from "react-icons/fi";
import { Role } from "@dti-isin/backend-api-client";
import {useAuth} from "../../hooks/useAuth.ts";

const roleLabels = {
    [Role.Admin]: "Amministratore",
    [Role.Teacher]: "Docente",
    [Role.Student]: "Studente"
};

const UserProfile = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center mb-8">
                    <Link
                        to="/"
                        className="btn btn-ghost hover:bg-primary/10 rounded-btn"
                    >
                        <FiArrowLeft className="mr-2" />
                        Torna alla Home
                    </Link>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-3xl mb-6 border-b pb-4 border-base-200">
                            <FiUser className="text-primary" />
                            Profilo Utente
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="col-span-1 flex items-center gap-2">
                                    <FiUser className="text-primary" />
                                    Nome:
                                </label>
                                <div className="col-span-2">
                                    <div className="input input-bordered w-full">
                                        {user?.name || "N/A"}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="col-span-1 flex items-center gap-2">
                                    <FiMail className="text-primary" />
                                    Email:
                                </label>
                                <div className="col-span-2">
                                    <div className="input input-bordered w-full">
                                        {user?.email || "N/A"}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="col-span-1 flex items-center gap-2">
                                    <FiKey className="text-primary" />
                                    Ruolo:
                                </label>
                                <div className="col-span-2">
                                    <div className="input input-bordered w-full">
                                        {user?.role ? roleLabels[user.role] : "N/A"}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <label className="col-span-1 flex items-center gap-2">
                                    <FiBook className="text-primary" />
                                    ID Utente:
                                </label>
                                <div className="col-span-2">
                                    <div className="input input-bordered w-full">
                                        {user?.azureOid || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;