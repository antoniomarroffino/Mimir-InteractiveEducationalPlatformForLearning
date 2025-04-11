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

    @Schema(required = true, description = "ID of the question this response is for")
    @NotNull(message = "Question ID cannot be null")
    private String questionId;

    @Schema(description = "Time spent on this question in seconds")
    private Integer timeSpent;

    @Schema(description = "Points earned for this response")
    private Integer earnedPoints = 0;


    public QuestionResponseDTO() {
        this.timeSpent = 0;
    }

    public QuestionResponseDTO(QuestionType responseType) {
        this.responseType = responseType;
    }

    public QuestionResponseDTO(QuestionType responseType, String questionId) {
        this.responseType = responseType;
        this.questionId = questionId;
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

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public Integer getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }

    public Integer getEarnedPoints() {
        return earnedPoints;
    }

    public void setEarnedPoints(Integer earnedPoints) {
        this.earnedPoints = earnedPoints != null ? earnedPoints : 0;
    }
}