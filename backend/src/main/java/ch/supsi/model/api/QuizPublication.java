package ch.supsi.model.api;

import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@MongoEntity(collection = "quiz_publications")
@Schema(description = "Quiz Publication model", name = "QuizPublication")
public class QuizPublication {

    @BsonId
    private ObjectId id;

    @Schema(required = true)
    private ObjectId courseId;

    @Schema(required = true)
    private ObjectId folderId;

    @Schema(required = true)
    private ObjectId quizId;

    @Schema(required = true)
    private String publicationCode;

    private boolean published = false;

    private boolean anonymous = true;

    public QuizPublication() {

    }

    public QuizPublication(ObjectId courseId, ObjectId folderId, ObjectId quizId, String publicationCode) {
        this.courseId = courseId;
        this.folderId = folderId;
        this.quizId = quizId;
        this.publicationCode = publicationCode;
    }

    public QuizPublication(ObjectId id, ObjectId courseId, ObjectId folderId, ObjectId quizId, String publicationCode) {
        this.id = id;
        this.courseId = courseId;
        this.folderId = folderId;
        this.quizId = quizId;
        this.publicationCode = publicationCode;
    }

    public ObjectId getId() {
        return this.id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getCourseId() {
        return this.courseId;
    }

    public void setCourseId(ObjectId courseId) {
        this.courseId = courseId;
    }

    public ObjectId getFolderId() {
        return this.folderId;
    }

    public void setFolderId(ObjectId folderId) {
        this.folderId = folderId;
    }

    public ObjectId getQuizId() {
        return this.quizId;
    }

    public void setQuizId(ObjectId quizId) {
        this.quizId = quizId;
    }

    public String getPublicationCode() {
        return this.publicationCode;
    }

    public void setPublicationCode(String publicationCode) {
        this.publicationCode = publicationCode;
    }

    public boolean isPublished() {
        return this.published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public boolean isAnonymous() {
        return this.anonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.anonymous = anonymous;
    }
}