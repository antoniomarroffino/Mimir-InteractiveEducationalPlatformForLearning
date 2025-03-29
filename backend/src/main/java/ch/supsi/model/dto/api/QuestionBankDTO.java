package ch.supsi.model.dto.api;

import ch.supsi.model.dto.api.question.QuestionDTO;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotBlank;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RegisterForReflection
public class QuestionBankDTO {
    private String id;
    @NotBlank(message = "Question bank name cannot be null or empty")
    private String name;
    @Schema(description = "Question's Id list")
    private List<QuestionDTO> questions;

    public QuestionBankDTO() {
        this.questions = new ArrayList<>();
    }

    public QuestionBankDTO(String name) {
        this();
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<QuestionDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDTO> questions) {
        this.questions = questions;
    }
}
