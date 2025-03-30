package ch.supsi.model.api;

import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.LocalDateTime;

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
    public String publicationCode;

    public Boolean published = false;

    public Boolean anonymous = true;

    public LocalDateTime createdAt;

    public LocalDateTime closedAt;

    public QuizPublication() {
        this.createdAt = LocalDateTime.now();
    }

    public QuizPublication(ObjectId courseId, ObjectId folderId, ObjectId quizId, String publicationCode) {
        this();
        this.courseId = courseId;
        this.folderId = folderId;
        this.quizId = quizId;
        this.publicationCode = publicationCode;
    }

    public QuizPublication(ObjectId id, ObjectId courseId, ObjectId folderId, ObjectId quizId, String publicationCode) {
        this(courseId, folderId, quizId, publicationCode);
        this.id = id;
    }

}