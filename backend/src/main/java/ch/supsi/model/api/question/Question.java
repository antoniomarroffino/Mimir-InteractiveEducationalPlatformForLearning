package ch.supsi.model.api.question;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Base Question model", name = "Question")
@BsonDiscriminator(key = "type")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = TrueFalseQuestion.class, name = "TRUE_FALSE"),
        @JsonSubTypes.Type(value = MultipleChoiceQuestion.class, name = "MULTIPLE_CHOICE")
})
public abstract class Question {
    public ObjectId id;

    public String questionText;

    public QuestionType type;

    protected Question() {
        this.id = new ObjectId();
    }

    protected Question(QuestionType type) {
        this();
        this.type = type;
    }

    protected Question(QuestionType type, String questionText) {
        this(type);
        this.questionText = questionText;
    }
}