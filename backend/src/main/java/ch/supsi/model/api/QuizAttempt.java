package ch.supsi.model.api;

import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.response.QuestionResponse;
import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@MongoEntity(collection = "quiz_attempts")
@Schema(description = "QuizAttempt model", name = "QuizAttempt")
public class QuizAttempt {
    @BsonId
    public ObjectId id;

    @Schema(description = "Reference to the quiz publication")
    public ObjectId quizPublicationId;

    @Schema(description = "User who attempted the quiz (can be null for anonymous)")
    public String userAzureOID;

    @Schema(description = "Timestamp when the attempt started")
    public LocalDateTime startedAt;

    @Schema(description = "Timestamp when the attempt was completed")
    public LocalDateTime completedAt;

    @Schema(description = "List of question responses")
    public List<QuestionResponse> responses;

    @Schema(description = "List of badges")
    public List<Badge> badges = new ArrayList<>();


    public QuizAttempt() {

    }

    public QuizAttempt(ObjectId quizPublicationId, String userAzureOID, LocalDateTime startedAt, LocalDateTime completedAt, List<QuestionResponse> responses) {
        this.quizPublicationId = quizPublicationId;
        this.userAzureOID = userAzureOID;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.responses = responses;
    }
}
