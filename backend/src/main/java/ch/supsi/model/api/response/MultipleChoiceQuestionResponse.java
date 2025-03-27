package ch.supsi.model.api.response;

import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;

@Schema(description = "Multiple Choice Question Response model", name = "MultipleChoiceQuestionResponse")
@BsonDiscriminator(key = "type", value = "MULTIPLE_CHOICE")
public class MultipleChoiceQuestionResponse extends QuestionResponse {
    public List<Integer> selectedAnswerIndexes;

    public MultipleChoiceQuestionResponse() {
        super(ResponseType.MULTIPLE_CHOICE);
    }

    public MultipleChoiceQuestionResponse(List<Integer> selectedAnswerIndexes) {
        super(ResponseType.MULTIPLE_CHOICE);
        this.selectedAnswerIndexes = selectedAnswerIndexes;
    }
}