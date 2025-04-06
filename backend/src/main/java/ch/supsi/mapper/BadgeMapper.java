package ch.supsi.mapper;

import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.dto.api.BadgeDTO;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class BadgeMapper implements IBaseMapper<Badge, BadgeDTO> {

    @Override
    public BadgeDTO toDTO(Badge badge) {
        if (badge == null) {
            return null;
        }

        BadgeDTO dto = new BadgeDTO();
        dto.setType(badge.type);
        dto.setAssignedAt(badge.assignedAt);
        dto.setAssignedBy(badge.assignedBy);

        return dto;
    }

    @Override
    public Badge toEntity(BadgeDTO dto) {
        if (dto == null) {
            return null;
        }

        Badge badge = new Badge();
        badge.type = dto.getType();
        badge.assignedAt = dto.getAssignedAt();
        badge.assignedBy = dto.getAssignedBy();

        return badge;
    }
}
