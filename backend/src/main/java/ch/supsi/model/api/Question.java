package ch.supsi.model.api;

import jakarta.validation.constraints.NotNull;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Base Question model", name = "Question")
public abstract class Question {
    private ObjectId id;

    private String questionText;

    @NotNull(message = "Question type cannot be null")
    private QuestionType type;

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

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public QuestionType getType() {
        return type;
    }

    protected void setType(QuestionType type) {
        this.type = type;
    }
}