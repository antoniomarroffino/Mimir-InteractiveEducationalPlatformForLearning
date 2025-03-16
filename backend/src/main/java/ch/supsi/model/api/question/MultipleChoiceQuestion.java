package ch.supsi.model.api.question;

import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

@Schema(description = "Multiple Choice Question model", name = "MultipleChoiceQuestion")
@BsonDiscriminator(key = "type", value = "MULTIPLE_CHOICE")
public class MultipleChoiceQuestion extends Question {
    private List<String> choices;
    private List<Integer> correctAnswerIndexes;

    public MultipleChoiceQuestion() {
        super(QuestionType.MULTIPLE_CHOICE);
        this.choices = new ArrayList<>();
        this.correctAnswerIndexes = new ArrayList<>();
    }

    public MultipleChoiceQuestion(String questionText, List<String> choices, List<Integer> correctAnswerIndexes) {
        super(QuestionType.MULTIPLE_CHOICE);
        setQuestionText(questionText);
        this.choices = choices;
        this.correctAnswerIndexes = correctAnswerIndexes;
    }

    public List<String> getChoices() {
        return choices;
    }

    public void setChoices(List<String> choices) {
        this.choices = choices;
    }

    public List<Integer> getCorrectAnswerIndexes() {
        return correctAnswerIndexes;
    }

    public void setCorrectAnswerIndexes(List<Integer> correctAnswerIndexes) {
        this.correctAnswerIndexes = correctAnswerIndexes;
    }
}