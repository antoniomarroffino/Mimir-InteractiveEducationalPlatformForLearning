package ch.supsi.model.api.question;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@MongoEntity(collection = "questions")
@Schema(description = "Base Question model", name = "Question")
@BsonDiscriminator(key = "_questionClass", value = "Question")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "_questionClass")
@JsonSubTypes({
        @JsonSubTypes.Type(value = TrueFalseQuestion.class, name = "TrueFalseQuestion"),
        @JsonSubTypes.Type(value = MultipleChoiceQuestion.class, name = "MultipleChoiceQuestion")
})
public abstract class Question {
    @BsonId
    public ObjectId id;

    public String questionText;
    @BsonProperty("type")
    public QuestionType type;

    public String questionBankId;

    protected Question() {
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