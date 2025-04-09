package ch.supsi.mapper;

import ch.supsi.model.api.BadgeHolder;
import ch.supsi.model.dto.api.BadgeHolderDTO;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;

@ApplicationScoped
public class BadgeHolderMapper implements IBaseMapper<BadgeHolder, BadgeHolderDTO> {

    @Override
    public BadgeHolderDTO toDTO(BadgeHolder badgeHolder) {
        if (badgeHolder == null) {
            return null;
        }

        BadgeHolderDTO dto = new BadgeHolderDTO();
        dto.setId(badgeHolder.id != null ? badgeHolder.id.toString() : null);
        dto.setAzureOID(badgeHolder.azureOID);
        dto.setBadges(badgeHolder.badges);

        return dto;
    }

    @Override
    public BadgeHolder toEntity(BadgeHolderDTO dto) {
        if (dto == null) {
            return null;
        }

        BadgeHolder badgeHolder = new BadgeHolder(dto.getAzureOID());

        if (dto.getId() != null) {
            badgeHolder.id = new ObjectId(dto.getId());
        }

        badgeHolder.badges = dto.getBadges();

        return badgeHolder;
    }
}
