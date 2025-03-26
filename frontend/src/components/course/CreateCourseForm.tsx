import React, {useState} from 'react';
import {FiPlus} from 'react-icons/fi';
import {useCourseCRUD} from "../../hooks/course/useCourseCRUD.ts";

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
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-control">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Course Title"
                    className="input input-bordered input-sm w-full focus:ring-1 ring-primary/50"
                    disabled={isCreatingCourse}
                    required
                />
            </div>

            <div className="form-control">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Course Description (Optional)"
                    className="textarea textarea-bordered textarea-xs w-full focus:ring-1 ring-primary/50"
                    disabled={isCreatingCourse}
                    rows={2}
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary btn-sm w-full"
                disabled={isCreatingCourse || !name.trim()}
            >
                {isCreatingCourse ? (
                    <span className="loading loading-spinner loading-xs"></span>
                ) : (
                    <>
                        <FiPlus className="text-lg mr-1"/>
                        Create
                    </>
                )}
            </button>
        </form>
    );
};