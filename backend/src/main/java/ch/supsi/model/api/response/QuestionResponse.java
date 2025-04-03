package ch.supsi.model.api.response;


import ch.supsi.model.api.question.QuestionType;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Base Question Response model", name = "QuestionResponse")
@BsonDiscriminator(key = "responseType")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "responseType")
@JsonSubTypes({
        @JsonSubTypes.Type(value = TrueFalseQuestionResponse.class, name = "TRUE_FALSE"),
        @JsonSubTypes.Type(value = MultipleChoiceQuestionResponse.class, name = "MULTIPLE_CHOICE")
})
public abstract class QuestionResponse {
    public ObjectId id;
    public QuestionType responseType;

    protected QuestionResponse() {
        this.id = new ObjectId();
    }

    protected QuestionResponse(QuestionType responseType) {
        this();
        this.responseType = responseType;
    }
}
