package ch.supsi.model.dto.api.question;

import ch.supsi.model.api.question.QuestionType;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotNull;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@RegisterForReflection
public class QuestionDTO {
    private String id;
    private String questionText;

    @Schema(required = true)
    @NotNull(message = "Question type cannot be null")
    private QuestionType type;

    private Boolean correctAnswer;

    public QuestionDTO() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public QuestionType getType() {
        return type;
    }

    public void setType(QuestionType type) {
        this.type = type;
    }

    public Boolean getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(Boolean correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}