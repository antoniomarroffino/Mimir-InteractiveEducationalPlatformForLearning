package ch.supsi.model.dto.api.question;

import ch.supsi.model.api.question.QuestionType;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotNull;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@RegisterForReflection
@Schema(description = "True/False Question DTO", name = "TrueFalseQuestionDTO")
@JsonTypeName("TRUE_FALSE")
public class TrueFalseQuestionDTO extends QuestionDTO {
    @NotNull(message = "Correct answer cannot be null")
    private Boolean correctAnswer;

    public TrueFalseQuestionDTO() {
        super(QuestionType.TRUE_FALSE);
    }

    public Boolean getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(Boolean correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}