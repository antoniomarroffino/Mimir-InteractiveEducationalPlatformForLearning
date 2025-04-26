import React, {useEffect, useState} from "react";
import {Role, UserWithoutCoursesDTO} from "@dti-isin/backend-api-client";
import {FiAlertTriangle, FiArrowUp, FiMail, FiUserPlus, FiUsers} from "react-icons/fi";
import {motion} from "framer-motion";
import {AdminDashboardHeader} from "./AdminDashboardHeader.tsx";
import {useAdmin} from "../../hooks/admin/useAdmin.ts";

const AdminDashboard = () => {
    const {promoteUser, teachers, isLoadingTeachers, errorTeachers, isLoading, error: errorPromoteUser} = useAdmin();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<Role>(Role.Student);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<UserWithoutCoursesDTO | null>(null);

    useEffect(() => {
        if (errorPromoteUser) {
            const errorMsg = errorPromoteUser.message.toLowerCase().includes("not found")
                ? "User not found with this email"
                : errorPromoteUser.message;
            setError(errorMsg);
        }
    }, [errorPromoteUser]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(email)) {
            setError("Invalid email format");
            return;
        }

        try {
            promoteUser(email, role);
            setEmail("");
            setSelectedTeacher(null);
        } catch (err) {
            setError("Connection error: " + err);
        }
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleTeacherClick = (teacher: UserWithoutCoursesDTO) => {
        if (selectedTeacher?.azureOid === teacher.azureOid) {
            setEmail("");
            setSelectedTeacher(null);
        } else {
            setEmail(teacher.email!);
            setSelectedTeacher(teacher);
        }
    };

    return (
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto space-y-10">
                <AdminDashboardHeader onToggleInfo={() => {}} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        className="card bg-base-100 shadow-xl"
                    >
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-6 border-b pb-4 border-base-200">
                                <FiArrowUp className="text-primary"/>
                                Change Role
                            </h2>

                            {(error || errorPromoteUser) && (
                                <div className="alert alert-error animate-fade-in-down">
                                    <FiAlertTriangle className="flex-shrink-0 w-6 h-6"/>
                                    <div className="flex flex-col text-left">
                                        <span className="font-bold">Operation failed!</span>
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
                                        className="input input-bordered input-primary w-full"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text flex items-center gap-2">
                                            <FiUserPlus className="text-primary"/>
                                            New Role
                                        </span>
                                    </label>
                                    <select
                                        className="select select-bordered select-primary w-full"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as Role)}
                                    >
                                        <option value={Role.Student}>👨🎓 Student</option>
                                        <option value={Role.Teacher}>👩🏫 Teacher</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEmail("");
                                            setError(null);
                                            setSelectedTeacher(null);
                                        }}
                                        className="btn btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`btn btn-primary gap-2 ${isLoading ? "loading" : ""}`}
                                        disabled={isLoading}
                                    >
                                        {!isLoading && <FiArrowUp className="text-xl"/>}
                                        {isLoading ? "Saving..." : "Update Role"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        className="card bg-base-100 shadow-xl"
                    >
                        <div className="card-body h-full">
                            <h2 className="card-title text-2xl mb-6 border-b pb-4 border-base-200">
                                <FiUsers className="text-primary"/>
                                Registered Teachers
                            </h2>

                            {errorTeachers && (
                                <div className="alert alert-error">
                                    <FiAlertTriangle className="flex-shrink-0 w-6 h-6"/>
                                    <span>{errorTeachers.message}</span>
                                </div>
                            )}

                            {isLoadingTeachers ? (
                                <div className="text-center py-8">
                                    <span className="loading loading-spinner text-primary"></span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {teachers?.length > 0 ? (
                                        teachers.map((teacher) => (
                                            <div
                                                key={teacher.azureOid}
                                                onClick={() => handleTeacherClick(teacher)}
                                                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                                                    selectedTeacher?.azureOid === teacher.azureOid
                                                        ? 'bg-primary/10 border-2 border-primary'
                                                        : 'hover:bg-base-200 border border-base-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="avatar placeholder">
                                                        <div
                                                            className="bg-neutral text-neutral-content rounded-full w-12">
                                                            <span>{teacher.name?.[0]?.toUpperCase() || teacher.email?.[0]?.toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{teacher.name || "No name available"}</h3>
                                                        <p className="text-sm text-base-content/60">{teacher.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-base-content/60 py-8">
                                            No registered teachers
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default AdminDashboard;
