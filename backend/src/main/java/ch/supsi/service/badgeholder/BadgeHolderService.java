package ch.supsi.service.badgeholder;

import ch.supsi.mapper.BadgeHolderMapper;
import ch.supsi.mapper.BadgeMapper;
import ch.supsi.model.api.BadgeHolder;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.BadgeHolderDTO;
import ch.supsi.repository.BadgeHolderRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class BadgeHolderService implements IBadgeHolderService {

    @Inject
    BadgeHolderRepository badgeHolderRepository;

    @Inject
    BadgeHolderMapper badgeHolderMapper;

    @Inject
    BadgeMapper badgeMapper;

    @Override
    public List<BadgeHolderDTO> getAllBadgeHolders() {
        return this.badgeHolderRepository
                .listAll()
                .stream()
                .map(this.badgeHolderMapper::toDTO)
                .toList();
    }

    @Override
    public BadgeHolderDTO getBadgeHolderByAzureOID(String azureOID) {
        Optional<BadgeHolder> badgeHolderOpt = this.badgeHolderRepository.findByAzureOIDOptional(azureOID);
        if (badgeHolderOpt.isEmpty()) {
            throw new NotFoundException("Badge holder with Azure OID " + azureOID + " not found");
        }
        return this.badgeHolderMapper.toDTO(badgeHolderOpt.get());
    }

    @Override
    public void addBadgeToHolder(String azureOID, BadgeDTO badgeDTO) {
        if (azureOID == null || badgeDTO == null) {
            throw new BadRequestException("Azure OID and badge cannot be null");
        }

        Optional<BadgeHolder> badgeHolderOpt = this.badgeHolderRepository.findByAzureOIDOptional(azureOID);
        BadgeHolder badgeHolder = badgeHolderOpt.orElseGet(() -> new BadgeHolder(azureOID));

        badgeHolder.badges.add(this.badgeMapper.toEntity(badgeDTO));
        this.badgeHolderRepository.persistOrUpdate(badgeHolder);
    }
}
