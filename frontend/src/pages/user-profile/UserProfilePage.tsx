import {FiBook, FiKey, FiMail, FiUser} from "react-icons/fi";
import {Role} from "@dti-isin/backend-api-client";
import {UserProfilePageHeader} from "./UserProfilePageHeader.tsx";
import {useAuth} from "../../hooks/auth/useAuth.ts";

const roleLabels = {
    [Role.Admin]: "Administrator",
    [Role.Teacher]: "Teacher",
    [Role.Student]: "Student"
};

const UserProfilePage = () => {
    const {user} = useAuth();

    return (
        <section className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
            <div className="max-w-7xl mx-auto space-y-10">
                <UserProfilePageHeader/>

                <div className="max-w-4xl mx-auto">
                    <div className="card bg-base-100 shadow-xl overflow-hidden">
                        <div className="card-body p-6">
                            <div className="space-y-6">
                                <div className="profile-field">
                                    <div className="profile-label">
                                        <FiUser className="text-primary"/>
                                        <span>Name</span>
                                    </div>
                                    <div className="profile-value">
                                        {user?.name || "N/A"}
                                    </div>
                                </div>

                                <div className="profile-field">
                                    <div className="profile-label">
                                        <FiMail className="text-primary"/>
                                        <span>Email</span>
                                    </div>
                                    <div className="profile-value">
                                        {user?.email || "N/A"}
                                    </div>
                                </div>

                                <div className="profile-field">
                                    <div className="profile-label">
                                        <FiKey className="text-primary"/>
                                        <span>Role</span>
                                    </div>
                                    <div className="profile-value">
                                        <span className="badge badge-primary">
                                            {user?.role ? roleLabels[user.role] : "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <div className="profile-field">
                                    <div className="profile-label">
                                        <FiBook className="text-primary"/>
                                        <span>User ID</span>
                                    </div>
                                    <div className="profile-value font-mono text-sm">
                                        {user?.azureOid || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserProfilePage;