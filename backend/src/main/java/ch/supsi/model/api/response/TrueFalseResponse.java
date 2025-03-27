package ch.supsi.model.api.response;

import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "True/False Question Response model", name = "TrueFalseResponse")
@BsonDiscriminator(key = "type", value = "TRUE_FALSE")
public class TrueFalseResponse extends QuestionResponse {
    public boolean selectedAnswer;

    public TrueFalseResponse() {
        super(ResponseType.TRUE_FALSE);
    }

    public TrueFalseResponse(boolean selectedAnswer) {
        super(ResponseType.TRUE_FALSE);
        this.selectedAnswer = selectedAnswer;
    }
}
