package ch.supsi.service.badgeholder;

import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.BadgeHolderDTO;

import java.util.List;

public interface IBadgeHolderService {
    List<BadgeHolderDTO> getAllBadgeHolders();

    BadgeHolderDTO getBadgeHolderByAzureOID(String azureOID);

    void addBadgeToHolder(String azureOID, BadgeDTO badgeDTO);
}