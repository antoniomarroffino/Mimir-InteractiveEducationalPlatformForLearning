package ch.supsi.model.api.response;

import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "True/False Question Response model", name = "TrueFalseQuestionResponse")
@BsonDiscriminator(key = "type", value = "TRUE_FALSE")
public class TrueFalseQuestionResponse extends QuestionResponse {
    public boolean selectedAnswer;

    public TrueFalseQuestionResponse() {
        super(ResponseType.TRUE_FALSE);
    }

    public TrueFalseQuestionResponse(boolean selectedAnswer) {
        super(ResponseType.TRUE_FALSE);
        this.selectedAnswer = selectedAnswer;
    }
}
