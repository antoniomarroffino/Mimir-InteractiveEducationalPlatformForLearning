package ch.supsi.model.api.question;

import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@MongoEntity(collection = "questions")
@Schema(description = "True/False Question model", name = "TrueFalseQuestion")
@BsonDiscriminator(key = "_questionClass", value = "TrueFalseQuestion")
public class TrueFalseQuestion extends Question {
    public Boolean correctAnswer;

    public TrueFalseQuestion() {
        super(QuestionType.TRUE_FALSE);
    }

    public TrueFalseQuestion(String questionText, Boolean correctAnswer) {
        super(QuestionType.TRUE_FALSE, questionText);
        this.correctAnswer = correctAnswer;
    }
}