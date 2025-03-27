package ch.supsi.model.api.response;

import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;

@Schema(description = "Multiple Choice Question Response model", name = "MultipleChoiceResponse")
@BsonDiscriminator(key = "type", value = "MULTIPLE_CHOICE")
public class MultipleChoiceResponse extends QuestionResponse {
    public List<Integer> selectedAnswerIndexes;

    public MultipleChoiceResponse() {
        super(ResponseType.MULTIPLE_CHOICE);
    }

    public MultipleChoiceResponse(List<Integer> selectedAnswerIndexes) {
        super(ResponseType.MULTIPLE_CHOICE);
        this.selectedAnswerIndexes = selectedAnswerIndexes;
    }
}