package ch.supsi.service.badgeholder;

import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.dto.api.BadgeHolderDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface IBadgeHolderService {
    List<BadgeHolderDTO> getAllBadgeHolders();
    BadgeHolderDTO getBadgeHolderByAzureOID(String azureOID);
    BadgeHolderDTO createBadgeHolder(BadgeHolderDTO badgeHolderDTO);
    BadgeHolderDTO updateBadgeHolder(ObjectId id, BadgeHolderDTO badgeHolderDTO);
    void deleteBadgeHolder(ObjectId id);
    void addBadgeToHolder(String azureOID, Badge badge);
}