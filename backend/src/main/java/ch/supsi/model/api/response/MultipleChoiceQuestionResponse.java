package ch.supsi.model.api.response;

import ch.supsi.model.api.question.QuestionType;
import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;

@Schema(description = "Multiple Choice Question Response model", name = "MultipleChoiceQuestionResponse")
@BsonDiscriminator(key = "_responseClass", value = "MultipleChoiceQuestionResponse")
public class MultipleChoiceQuestionResponse extends QuestionResponse {
    public List<Integer> selectedAnswerIndexes;

    public MultipleChoiceQuestionResponse() {
        super(QuestionType.MULTIPLE_CHOICE);
    }

    public MultipleChoiceQuestionResponse(List<Integer> selectedAnswerIndexes) {
        super(QuestionType.MULTIPLE_CHOICE);
        this.selectedAnswerIndexes = selectedAnswerIndexes;
    }
}