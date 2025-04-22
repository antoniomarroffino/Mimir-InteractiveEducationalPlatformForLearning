import React, {useState} from 'react';
import {FiBookOpen, FiPlus} from 'react-icons/fi';
import {useCourseCRUD} from '../../hooks/course/useCourseCRUD';

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
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-secondary/20">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3">
                    <FiBookOpen className="text-2xl text-primary"/>
                    <h3 className="text-xl font-bold text-primary">New Course</h3>
                </div>

                <div className="form-control">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Course title"
                        className="input input-bordered w-full text-sm"
                        disabled={isCreatingCourse}
                        required
                    />
                </div>

                <div className="form-control">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Course description (optional)"
                        className="textarea textarea-bordered w-full text-sm resize-none"
                        rows={2}
                        disabled={isCreatingCourse}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full gap-2 transition-transform hover:scale-[0.98]"
                    disabled={isCreatingCourse || !name.trim()}
                >
                    {isCreatingCourse ? (
                        <span className="loading loading-spinner"/>
                    ) : (
                        <>
                            <FiPlus className="text-lg"/>
                            Create Course
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
