package ch.supsi.model.dto.api.response;

import ch.supsi.model.api.question.QuestionType;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotNull;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@RegisterForReflection
@Schema(description = "True/False Response DTO", name = "TrueFalseResponseDTO")
@JsonTypeName("TRUE_FALSE")
public class TrueFalseQuestionResponseDTO extends QuestionResponseDTO {
    @NotNull(message = "Selected answer cannot be null")
    private Boolean selectedAnswer;

    public TrueFalseQuestionResponseDTO() {
        this.setType(QuestionType.TRUE_FALSE);
    }

    public Boolean getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(Boolean selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }
}