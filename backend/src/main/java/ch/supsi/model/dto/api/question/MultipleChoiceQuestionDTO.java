package ch.supsi.model.dto.api.question;

import ch.supsi.model.api.question.QuestionType;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotNull;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;

@RegisterForReflection
@Schema(description = "Multiple Choice Question DTO", name = "MultipleChoiceQuestionDTO")
@JsonTypeName("MULTIPLE_CHOICE")
public class MultipleChoiceQuestionDTO extends QuestionDTO {
    @NotNull(message = "Choices cannot be null")
    private List<String> choices;

    @NotNull(message = "Correct answer indexes cannot be null")
    private List<Integer> correctAnswerIndexes;

    public MultipleChoiceQuestionDTO() {
        this.setType(QuestionType.MULTIPLE_CHOICE);
    }

    public List<String> getChoices() {
        return choices;
    }

    public void setChoices(List<String> choices) {
        this.choices = choices;
    }

    public List<Integer> getCorrectAnswerIndexes() {
        return correctAnswerIndexes;
    }

    public void setCorrectAnswerIndexes(List<Integer> correctAnswerIndexes) {
        this.correctAnswerIndexes = correctAnswerIndexes;
    }
}