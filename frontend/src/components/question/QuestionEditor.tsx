import {QuestionType} from "./QuestionTypes.ts";

interface QuestionEditorProps {
    questionType: QuestionType;
    onSave: (question: Partial<Question>) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
                                                                  questionType,
                                                                  onSave
                                                              }) => {
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState<string[]>(['']);
    const [correctAnswer, setCorrectAnswer] = useState<number | boolean>(
        questionType === QuestionType.TRUE_FALSE ? true : 0
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            text: questionText,
            type: questionType,
            answers,
            correctAnswer
        });
        setQuestionText('');
        setAnswers(['']);
        setCorrectAnswer(questionType === QuestionType.TRUE_FALSE ? true : 0);
    };

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create Question</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Question</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered h-24"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Enter your question"
                    />
                </div>

                {questionType === QuestionType.TRUE_FALSE ? (
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Correct Answer</span>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={correctAnswer as boolean}
                                onChange={(e) => setCorrectAnswer(e.target.checked)}
                            />
                        </label>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="label">
                            <span className="label-text">Answers</span>
                        </label>
                        {answers.map((answer, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    className="input input-bordered flex-1"
                                    value={answer}
                                    onChange={(e) => {
                                        const newAnswers = [...answers];
                                        newAnswers[index] = e.target.value;
                                        setAnswers(newAnswers);
                                    }}
                                    placeholder={`Answer ${index + 1}`}
                                />
                                <input
                                    type={questionType === QuestionType.MULTIPLE_CHOICE ? 'checkbox' : 'radio'}
                                    name="correct"
                                    checked={
                                        questionType === QuestionType.MULTIPLE_CHOICE
                                            ? (correctAnswer as number[]).includes(index)
                                            : correctAnswer === index
                                    }
                                    onChange={() => setCorrectAnswer(index)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-square"
                                    onClick={() => {
                                        const newAnswers = answers.filter((_, i) => i !== index);
                                        setAnswers(newAnswers);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-outline btn-block"
                            onClick={() => setAnswers([...answers, ''])}
                        >
                            Add Answer
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={!questionText.trim()}
                >
                    Save Question
                </button>
            </form>
        </div>
    );
};