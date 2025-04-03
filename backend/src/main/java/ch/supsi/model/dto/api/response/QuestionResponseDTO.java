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
    private QuestionType responseType;

    public QuestionResponseDTO() {
    }

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

    public void setResponseType(QuestionType responseType) {
        this.responseType = responseType;
    }
}