import React from "react";
import {QuestionType} from "./QuestionTypes.ts";

interface Question {
    id: string;
    text: string;
    type: QuestionType;
}

export const QuestionsList: React.FC<{ questions: Question[] }> = ({ questions }) => (
    <div className="bg-base-100 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Questions</h2>
        <div className="space-y-2">
            {questions.length === 0 ? (
                <p className="text-base-content/70">No questions yet</p>
            ) : (
                questions.map((question, index) => (
                    <div
                        key={question.id}
                        className="p-3 bg-base-200 rounded flex justify-between items-center"
                    >
                        <span>
                            {index + 1}. {question.text}
                        </span>
                        <span className="badge badge-primary">{question.type}</span>
                    </div>
                ))
            )}
        </div>
    </div>
);