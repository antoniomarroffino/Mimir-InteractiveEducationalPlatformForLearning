import React, { useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { useQuizContext } from '../../contexts/quiz/QuizContext';

export const CreateQuizButton = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState('');
    const { createQuiz } = useQuizContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            try {
                await createQuiz(name);
                setName('');
                setIsCreating(false);
            } catch (error) {
                console.error('Failed to create quiz:', error);
            }
        }
    };

    if (!isCreating) {
        return (
            <button
                className="w-full p-4 border-2 border-dashed border-base-300 rounded-lg
                         hover:border-primary hover:bg-base-200 transition-all group"
                onClick={() => setIsCreating(true)}
            >
                <div className="flex items-center justify-center gap-2">
                    <BsPlus className="text-2xl text-base-content/70 group-hover:text-primary" />
                    <span className="text-base-content/70 group-hover:text-primary">Create New Quiz</span>
                </div>
            </button>
        );
    }

    return (
        <div className="bg-base-200 rounded-lg p-4">
            <form onSubmit={handleSubmit}>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Quiz Name</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter quiz name"
                            className="input input-bordered flex-1"
                            autoFocus
                        />
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => setIsCreating(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!name.trim()}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};