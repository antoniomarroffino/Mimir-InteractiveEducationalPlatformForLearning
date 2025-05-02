package ch.supsi.model.api;

import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@MongoEntity(collection = "question_banks")
@Schema(description = "QuestionBank model", name = "QuestionBank")
public class QuestionBank {
    @BsonId
    public ObjectId id;
    public String name;
    public LocalDateTime lastModified;
    public List<String> questions;

    public QuestionBank() {
        this.lastModified = LocalDateTime.now();
        this.questions = new ArrayList<>();
    }

    public QuestionBank(String name) {
        this();
        this.name = name;
    }
}
