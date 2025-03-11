package ch.supsi.model.api.question;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "True/False Question model", name = "TrueFalseQuestion")
public class TrueFalseQuestion extends Question {
    private boolean correctAnswer;

    public TrueFalseQuestion() {
        super(QuestionType.TRUE_FALSE);
    }

    public TrueFalseQuestion(String questionText, boolean correctAnswer) {
        super(QuestionType.TRUE_FALSE);
        setQuestionText(questionText);
        this.correctAnswer = correctAnswer;
    }

    public boolean isCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(boolean correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}