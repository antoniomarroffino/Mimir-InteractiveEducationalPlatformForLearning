package ch.supsi.model.api.response;


import ch.supsi.model.api.question.QuestionType;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Base Question Response model", name = "QuestionResponse")
@BsonDiscriminator(key = "_responseClass", value = "QuestionResponse")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "_responseClass")
@JsonSubTypes({
        @JsonSubTypes.Type(value = TrueFalseQuestionResponse.class, name = "TrueFalseQuestionResponse"),
        @JsonSubTypes.Type(value = MultipleChoiceQuestionResponse.class, name = "MultipleChoiceQuestionResponse")
})
public abstract class QuestionResponse {
    public ObjectId id;
    @BsonProperty("responseType")
    public QuestionType responseType;
    public ObjectId questionId;
    @BsonProperty("timeSpent")
    public Integer timeSpent;

    protected QuestionResponse() {
        this.id = new ObjectId();
        this.timeSpent = 0;
    }

    protected QuestionResponse(QuestionType responseType) {
        this();
        this.responseType = responseType;
    }

    protected QuestionResponse(QuestionType responseType, ObjectId questionId) {
        this();
        this.responseType = responseType;
        this.questionId = questionId;
    }
}
