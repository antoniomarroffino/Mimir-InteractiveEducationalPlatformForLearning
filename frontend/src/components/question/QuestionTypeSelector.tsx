import {QuestionType} from "./QuestionTypes.ts";

interface QuestionTypeSelectorProps {
    selectedType: QuestionType;
    onTypeChange: (type: QuestionType) => void;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
                                                                              selectedType,
                                                                              onTypeChange
                                                                          }) => (
    <div className="bg-base-100 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Question Type</h2>
        <div className="space-y-2">
            {Object.values(QuestionType).map((type) => (
                <button
                    key={type}
                    className={`btn btn-block ${
                        selectedType === type ? 'btn-primary' : 'btn-ghost'
                    }`}
                    onClick={() => onTypeChange(type)}
                >
                    {type}
                </button>
            ))}
        </div>
    </div>
);