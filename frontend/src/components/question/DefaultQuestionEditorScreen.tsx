import React from 'react';
import {LightBulbIcon} from '@heroicons/react/24/outline';

interface DefaultQuestionEditorScreenProps {
    isPreview?: boolean;
}

export const DefaultQuestionEditorScreen: React.FC<DefaultQuestionEditorScreenProps> = ({isPreview = false}) => {
    return (
        <div className="bg-base-100 rounded-lg p-6 shadow-lg border-2 border-dashed border-primary/20">
            {isPreview ? (
                <div className="text-center space-y-4">
                    <LightBulbIcon className="w-12 h-12 text-primary mx-auto mb-4"/>
                    <h3 className="text-xl font-semibold text-primary mb-2">Question Preview</h3>
                    <p className="text-base-content/70 mb-4">
                        This is a live preview of how the question will appear in the quiz.
                    </p>
                    <div className="bg-primary/5 p-4 rounded-lg">
                        <p className="text-sm text-primary/80">
                            📌 Select questions from the Question Banks panel to build your quiz
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-4">
                    <LightBulbIcon className="w-12 h-12 text-primary mx-auto mb-4"/>
                    <h3 className="text-xl font-semibold text-primary mb-2">
                        {isPreview ? 'Question Preview' : 'Create New Question'}
                    </h3>
                    <p className="text-base-content/70">
                        {isPreview
                            ? 'Select a question type to start editing'
                            : 'Select a question type from the toolbar above to start creating your question'}
                    </p>
                    <div className="bg-primary/5 p-4 rounded-lg mt-4">
                        <p className="text-sm text-primary/80">
                            💡 Pro tip: Use the question banks to browse and import existing questions
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};