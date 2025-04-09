package ch.supsi.model.api;

import ch.supsi.model.api.badge.Badge;
import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

@MongoEntity(collection = "badge_holders")
@Schema(description = "Badge holder model", name = "BadgeHolder")
public class BadgeHolder {
    @BsonId
    public ObjectId id;
    public String azureOID;
    public List<Badge> badges = new ArrayList<>();

    public BadgeHolder() {
    }

    public BadgeHolder(String azureOID) {
        this.azureOID = azureOID;
    }
}