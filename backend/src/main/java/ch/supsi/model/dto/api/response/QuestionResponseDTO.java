package ch.supsi.model.dto.api.response;

import ch.supsi.model.api.question.QuestionType;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotNull;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "responseType",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = TrueFalseQuestionResponseDTO.class, name = "TRUE_FALSE"),
        @JsonSubTypes.Type(value = MultipleChoiceQuestionResponseDTO.class, name = "MULTIPLE_CHOICE")
})
@RegisterForReflection
public abstract class QuestionResponseDTO {
    private String id;

    @Schema(required = true)
    @NotNull(message = "Response type cannot be null")
    private final QuestionType responseType;

    @Schema(required = true, description = "ID of the question this response is for")
    @NotNull(message = "Question ID cannot be null")
    private String questionId;

    public QuestionResponseDTO(QuestionType responseType) {
        this.responseType = responseType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public QuestionType getResponseType() {
        return responseType;
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }
}