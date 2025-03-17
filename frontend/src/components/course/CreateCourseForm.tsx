import React, { useState } from 'react';
import { useCourse } from '../../hooks/useCourse';
import { FiPlus } from 'react-icons/fi';

const CreateCourseForm = () => {
    const [name, setName] = useState('');
    const { createCourse, isCreatingCourse } = useCourse();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            try {
                await createCourse(name);
                setName('');
            } catch (error) {
                console.error('Failed to create course:', error);
            }
        }
    };

    return (
        <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-dashed border-base-300 hover:border-primary/30 transition-colors">
            <h3 className="font-semibold text-lg mb-4">Create New Course</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Course Title"
                        className="input input-bordered w-full focus:ring-2 ring-primary/50"
                        disabled={isCreatingCourse}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isCreatingCourse || !name.trim()}
                >
                    {isCreatingCourse ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <>
                            <FiPlus className="text-xl mr-2" />
                            Create Course
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateCourseForm;