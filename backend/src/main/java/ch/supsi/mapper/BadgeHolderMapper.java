package ch.supsi.mapper;

import ch.supsi.model.api.BadgeHolder;
import ch.supsi.model.dto.api.BadgeHolderDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.stream.Collectors;

@ApplicationScoped
public class BadgeHolderMapper implements IBaseMapper<BadgeHolder, BadgeHolderDTO> {
    @Inject
    BadgeMapper badgeMapper;

    @Override
    public BadgeHolderDTO toDTO(BadgeHolder badgeHolder) {
        if (badgeHolder == null) {
            return null;
        }

        BadgeHolderDTO dto = new BadgeHolderDTO();
        dto.setId(badgeHolder.id.toString());
        dto.setUser(new UserWithoutCoursesDTO(badgeHolder.azureOID, null, null, null));
        dto.setBadges(badgeHolder.badges.stream().map(this.badgeMapper::toDTO).toList());

        return dto;
    }

    @Override
    public BadgeHolder toEntity(BadgeHolderDTO dto) {
        if (dto == null) {
            return null;
        }

        BadgeHolder badgeHolder = new BadgeHolder(dto.getUser().getAzureOid());

        if (dto.getId() != null) {
            badgeHolder.id = new ObjectId(dto.getId());
        }

        badgeHolder.badges = dto.getBadges().stream().map(this.badgeMapper::toEntity).toList();

        return badgeHolder;
    }
}
