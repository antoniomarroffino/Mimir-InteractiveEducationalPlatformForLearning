import {FiBook, FiKey, FiMail, FiUser} from "react-icons/fi";
import {Role} from "@dti-isin/backend-api-client";
import {useAuth} from "../../hooks/useAuth.ts";

const roleLabels = {
    [Role.Admin]: "Administrator",
    [Role.Teacher]: "Teacher",
    [Role.Student]: "Student"
};

const UserProfile = () => {
    const {user} = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="card bg-base-100 shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content">
                                    <FiUser className="w-8 h-8"/>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        User Profile
                                    </h1>
                                    <p className="text-base-content/70">
                                        Manage your account information
                                    </p>
                                </div>
                            </div>
                        </div>

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
        </div>
    );
};

export default UserProfile;