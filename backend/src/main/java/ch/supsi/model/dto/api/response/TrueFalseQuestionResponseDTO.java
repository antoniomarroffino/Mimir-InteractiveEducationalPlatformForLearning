package ch.supsi.model.dto.api.response;

import ch.supsi.model.api.question.QuestionType;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.quarkus.runtime.annotations.RegisterForReflection;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@RegisterForReflection
@Schema(description = "True/False Response DTO", name = "TrueFalseQuestionResponseDTO")
@JsonTypeName("TRUE_FALSE")
public class TrueFalseQuestionResponseDTO extends QuestionResponseDTO {
    private Boolean selectedAnswer;

    public TrueFalseQuestionResponseDTO() {
        super(QuestionType.TRUE_FALSE);
    }

    public TrueFalseQuestionResponseDTO(String questionId) {
        super(QuestionType.TRUE_FALSE, questionId);
    }

    public Boolean getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(Boolean selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }
}