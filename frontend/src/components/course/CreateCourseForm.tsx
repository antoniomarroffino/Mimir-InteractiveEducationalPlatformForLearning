import React, {useState} from 'react';
import {FiPlus} from 'react-icons/fi';
import {useCourseCRUD} from "../../hooks/course/useCourseCRUD.ts";
import {PlusCircleIcon} from "@heroicons/react/24/outline";

export const CreateCourseForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const {createCourse, isCreatingCourse} = useCourseCRUD();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            try {
                await createCourse({name, description: description.trim() || undefined});
                setName('');
                setDescription('');
            } catch (error) {
                console.error('Failed to create course:', error);
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-indigo-100 max-w-sm mx-auto">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 text-indigo-900">
                <PlusCircleIcon className="w-5 h-5"/>
                Create New Course
            </h2>
            <p className="text-sm text-base-content/70 mb-4">
                Transform your knowledge into an interactive journey for your students.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Course Title"
                        className="input input-sm w-full rounded-lg border border-indigo-200 bg-white text-sm shadow-sm focus:ring-2 ring-indigo-300 transition-all duration-200"
                        disabled={isCreatingCourse}
                        required
                    />
                </div>

                <div className="form-control">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Course Description (Optional)"
                        className="textarea textarea-sm w-full rounded-lg border border-indigo-200 bg-white text-sm shadow-sm focus:ring-2 ring-indigo-300 transition-all duration-200 resize-none"
                        disabled={isCreatingCourse}
                        rows={2}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-sm btn-primary w-full flex items-center justify-center gap-2 transition-all duration-200"
                    disabled={isCreatingCourse || !name.trim()}
                >
                    {isCreatingCourse ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <>
                            <FiPlus className="text-base"/>
                            <span>Create</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
