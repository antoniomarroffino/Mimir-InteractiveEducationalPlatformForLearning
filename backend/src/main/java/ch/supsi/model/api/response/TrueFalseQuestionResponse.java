package ch.supsi.model.api.response;

import ch.supsi.model.api.question.QuestionType;
import org.bson.codecs.pojo.annotations.BsonDiscriminator;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "True/False Question Response model", name = "TrueFalseQuestionResponse")
@BsonDiscriminator(key = "_responseClass", value = "TrueFalseQuestionResponse")
public class TrueFalseQuestionResponse extends QuestionResponse {
    public Boolean selectedAnswer;

    public TrueFalseQuestionResponse() {
        super(QuestionType.TRUE_FALSE);
    }

    public TrueFalseQuestionResponse(Boolean selectedAnswer) {
        super(QuestionType.TRUE_FALSE);
        this.selectedAnswer = selectedAnswer;
    }
}
