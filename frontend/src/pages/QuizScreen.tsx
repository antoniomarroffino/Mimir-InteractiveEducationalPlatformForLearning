import {useState} from 'react';

import {useQuizRetrieve} from "../hooks/useQuizRetrieve.ts";

const QuizScreen = () => {
    const {quiz, error: errorQuiz} = useQuizRetrieve();
    const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);


    if (errorQuiz) return <div>Error fetching quiz: {errorQuiz.message}</div>;

    if (!quiz) return <div>Quiz not found</div>;

    const handleStartQuiz = () => {
        setIsQuizStarted(true);
    };

    return (
        <div>
            <h1>{quiz.name}</h1>
            <p>Descrizione del quiz: {quiz.description}</p>
            {/* Aggiungi altre informazioni del quiz qui */}
            {!isQuizStarted ? (
                <button onClick={handleStartQuiz}>Inizia il Quiz</button>
            ) : (
                <div>
                    <h2>Quiz iniziato!</h2>
                    {/* Aggiungi qui la logica per mostrare le domande del quiz */}
                </div>
            )}
        </div>
    );
};

export default QuizScreen;