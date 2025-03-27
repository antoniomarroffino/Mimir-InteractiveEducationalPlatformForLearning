package ch.supsi.model.dto.api.response;

import ch.supsi.model.api.response.ResponseType;
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
        @JsonSubTypes.Type(value = TrueFalseQuestionResponseDTO.class, name = "TRUE_FALSE"),
        @JsonSubTypes.Type(value = MultipleChoiceQuestionResponseDTO.class, name = "MULTIPLE_CHOICE")
})
@RegisterForReflection
public abstract class QuestionResponseDTO {
    private String id;

    @Schema(required = true)
    @NotNull(message = "Response type cannot be null")
    private ResponseType type;

    public QuestionResponseDTO() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ResponseType getType() {
        return type;
    }

    public void setType(ResponseType type) {
        this.type = type;
    }
}