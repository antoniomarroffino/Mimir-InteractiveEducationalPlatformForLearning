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

    public QuizPublicationDTO() {
    }

    public QuizPublicationDTO(String id, String courseId, String folderId, String quizId, String publicationCode) {
        this.id = id;
        this.courseId = courseId;
        this.folderId = folderId;
        this.quizId = quizId;
        this.publicationCode = publicationCode;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getFolderId() {
        return folderId;
    }

    public void setFolderId(String folderId) {
        this.folderId = folderId;
    }

    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }

    public String getPublicationCode() {
        return publicationCode;
    }

    public void setPublicationCode(String publicationCode) {
        this.publicationCode = publicationCode;
    }
}