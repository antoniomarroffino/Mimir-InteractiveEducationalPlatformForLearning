package ch.supsi.model.api.response;

import ch.supsi.model.api.question.QuestionType;
import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;

@Schema(description = "Multiple Choice Question Response model", name = "MultipleChoiceQuestionResponse")
@BsonDiscriminator(key = "_responseClass", value = "MultipleChoiceQuestionResponse")
public class MultipleChoiceQuestionResponse extends QuestionResponse {
    public List<Integer> selectedAnswerIndexes;

    public MultipleChoiceQuestionResponse() {
        super(QuestionType.MULTIPLE_CHOICE);
    }

    public MultipleChoiceQuestionResponse(ObjectId questionId) {
        super(QuestionType.MULTIPLE_CHOICE, questionId);
    }

    public MultipleChoiceQuestionResponse(List<Integer> selectedAnswerIndexes, ObjectId questionId) {
        super(QuestionType.MULTIPLE_CHOICE, questionId);
        this.selectedAnswerIndexes = selectedAnswerIndexes;
    }
}