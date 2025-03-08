import React, { useState } from 'react';
import { useCourseContext } from '../../contexts/course/CourseContext.tsx';

const CreateCourseForm = () => {
    const [name, setName] = useState('');
    const { createCourse, isLoading } = useCourseContext();

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
        <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-6">
            <h3 className="text-lg font-bold mb-4">Create New Course</h3>
            <div className="join w-full">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter course name"
                    className="input input-bordered join-item flex-1"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="btn btn-primary join-item"
                    disabled={isLoading || !name.trim()}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        'Create Course'
                    )}
                </button>
            </div>
        </form>
    );
};

export default CreateCourseForm;