package ch.supsi.model.dto.api.response;

import ch.supsi.model.api.question.QuestionType;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotNull;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;

@RegisterForReflection
@Schema(description = "Multiple Choice Response DTO", name = "MultipleChoiceQuestionResponseDTO")
@JsonTypeName("MULTIPLE_CHOICE")
public class MultipleChoiceQuestionResponseDTO extends QuestionResponseDTO {
    private List<Integer> selectedAnswerIndexes;

    public MultipleChoiceQuestionResponseDTO() {
        super(QuestionType.MULTIPLE_CHOICE);
    }

    public List<Integer> getSelectedAnswerIndexes() {
        return selectedAnswerIndexes;
    }

    public void setSelectedAnswerIndexes(List<Integer> selectedAnswerIndexes) {
        this.selectedAnswerIndexes = selectedAnswerIndexes;
    }
}