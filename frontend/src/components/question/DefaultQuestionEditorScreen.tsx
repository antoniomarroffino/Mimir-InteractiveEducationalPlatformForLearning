import React from 'react';
import {
    BsQuestionDiamond,
    BsLightbulb,
    BsListCheck
} from 'react-icons/bs';

export const DefaultQuestionEditorScreen: React.FC = () => {
    return (
        <div className="bg-base-100 rounded-lg p-8 shadow flex flex-col items-center justify-center text-center">
            <div className="mb-6 opacity-50">
                <BsQuestionDiamond className="text-6xl mx-auto text-primary/50" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-base-content/70">
                Ready to Create Questions?
            </h2>
            <div className="max-w-md text-base-content/60 mb-6">
                <p>
                    Start by clicking the "+" button to begin crafting
                    engaging questions for your quiz.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="bg-base-200 rounded-lg p-4 text-center">
                    <BsLightbulb className="text-3xl mx-auto mb-2 text-warning" />
                    <h3 className="font-semibold mb-2">Tip 1</h3>
                    <p className="text-sm text-base-content/70">
                        Clear and concise questions work best
                    </p>
                </div>
                <div className="bg-base-200 rounded-lg p-4 text-center">
                    <BsListCheck className="text-3xl mx-auto mb-2 text-success" />
                    <h3 className="font-semibold mb-2">Tip 2</h3>
                    <p className="text-sm text-base-content/70">
                        Vary your question types for engaging quizzes
                    </p>
                </div>
            </div>
        </div>
    );
};