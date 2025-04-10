package ch.supsi.model.dto.api.question;

import ch.supsi.model.api.question.QuestionType;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotNull;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = TrueFalseQuestionDTO.class, name = "TRUE_FALSE"),
        @JsonSubTypes.Type(value = MultipleChoiceQuestionDTO.class, name = "MULTIPLE_CHOICE")
})
@RegisterForReflection
public abstract class QuestionDTO {
    private String id;
    private String questionText;

    @Schema(required = true)
    @NotNull(message = "Question type cannot be null")
    private final QuestionType type;

    private String questionBankId;

    public QuestionDTO(QuestionType type) {
        this.type = type;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuestionText() {
        return this.questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public QuestionType getType() {
        return this.type;
    }

    public String getQuestionBankId() {
        return this.questionBankId;
    }

    public void setQuestionBankId(String questionBankId) {
        this.questionBankId = questionBankId;
    }
}