package ch.supsi.model.api;

import ch.supsi.model.api.question.Question;
import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@MongoEntity(collection = "quiz_publications")
@Schema(description = "Quiz Publication model", name = "QuizPublication")
public class QuizPublication {

    @BsonId
    public ObjectId id;

    @Schema(required = true)
    public ObjectId courseId;

    @Schema(required = true)
    public ObjectId folderId;

    @Schema(required = true)
    public ObjectId quizId;

    @Schema(required = true)
    public List<Question> questions;

    @Schema(required = true)
    public String publicationCode;

    public Boolean published;

    public Boolean anonymous;

    public LocalDateTime createdAt;

    public LocalDateTime closedAt;

    public QuizPublication() {
        this.published = false;
        this.anonymous = true;
        this.createdAt = LocalDateTime.now();
    }

    public QuizPublication(ObjectId courseId, ObjectId folderId, ObjectId quizId,
                           List<Question> questions, String publicationCode) {
        this();
        this.courseId = courseId;
        this.folderId = folderId;
        this.quizId = quizId;
        this.questions = questions;
        this.publicationCode = publicationCode;
    }

}