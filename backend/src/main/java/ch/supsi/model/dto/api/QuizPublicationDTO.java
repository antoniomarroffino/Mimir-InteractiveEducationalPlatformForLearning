package ch.supsi.model.dto.api;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotBlank;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@RegisterForReflection
public class QuizPublicationDTO {

    @Schema(description = "ID univoco della pubblicazione (generato dal backend)", readOnly = true)
    private String id;

    @NotBlank(message = "Course ID cannot be null or empty")
    @Schema(description = "ID del corso associato", required = true)
    private String courseId;

    @NotBlank(message = "Folder ID cannot be null or empty")
    @Schema(description = "ID della cartella associata", required = true)
    private String folderId;

    @NotBlank(message = "Quiz ID cannot be null or empty")
    @Schema(description = "ID del quiz associato", required = true)
    private String quizId;

    @Schema(description = "Codice di pubblicazione generato dal backend", readOnly = true)
    private String publicationCode;

    private boolean published;

    private boolean anonymous;

    public QuizPublicationDTO() {
        this.published = false;
        this.anonymous = true;
    }

    public QuizPublicationDTO(String id, String courseId, String folderId, String quizId, String publicationCode) {
        this();
        this.id = id;
        this.courseId = courseId;
        this.folderId = folderId;
        this.quizId = quizId;
        this.publicationCode = publicationCode;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCourseId() {
        return this.courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getFolderId() {
        return this.folderId;
    }

    public void setFolderId(String folderId) {
        this.folderId = folderId;
    }

    public String getQuizId() {
        return this.quizId;
    }

    public void setQuizId(String quizId) {
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