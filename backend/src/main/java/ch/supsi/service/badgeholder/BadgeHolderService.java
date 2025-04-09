package ch.supsi.service.badgeholder;

import ch.supsi.mapper.BadgeHolderMapper;
import ch.supsi.model.api.BadgeHolder;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.dto.api.BadgeHolderDTO;
import ch.supsi.repository.BadgeHolderRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class BadgeHolderService implements IBadgeHolderService {

    @Inject
    BadgeHolderRepository badgeHolderRepository;

    @Inject
    BadgeHolderMapper badgeHolderMapper;

    @Override
    public List<BadgeHolderDTO> getAllBadgeHolders() {
        return this.badgeHolderRepository.findAll().stream()
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
    public BadgeHolderDTO createBadgeHolder(BadgeHolderDTO badgeHolderDTO) {
        this.verifyBadgeHolderIsValid(badgeHolderDTO);

        if (this.badgeHolderRepository.findByAzureOIDOptional(badgeHolderDTO.getAzureOID()).isPresent()) {
            throw new BadRequestException("Badge holder with Azure OID " + badgeHolderDTO.getAzureOID() + " already exists");
        }

        BadgeHolder badgeHolder = this.badgeHolderMapper.toEntity(badgeHolderDTO);
        this.badgeHolderRepository.persist(badgeHolder);

        return this.badgeHolderMapper.toDTO(badgeHolder);
    }

    @Override
    public BadgeHolderDTO updateBadgeHolder(ObjectId id, BadgeHolderDTO badgeHolderDTO) {
        this.verifyBadgeHolderIsValid(badgeHolderDTO);

        Optional<BadgeHolder> badgeHolderOpt = this.badgeHolderRepository.findByIdOptional(id);
        if (badgeHolderOpt.isEmpty()) {
            throw new NotFoundException("Badge holder " + id + " not found");
        }

        BadgeHolder existingBadgeHolder = badgeHolderOpt.get();
        existingBadgeHolder.badges = badgeHolderDTO.getBadges();

        this.badgeHolderRepository.update(existingBadgeHolder);

        return this.badgeHolderMapper.toDTO(existingBadgeHolder);
    }

    @Override
    public void deleteBadgeHolder(ObjectId id) {
        Optional<BadgeHolder> badgeHolderOpt = this.badgeHolderRepository.findByIdOptional(id);
        if (badgeHolderOpt.isEmpty()) {
            throw new NotFoundException("Badge holder " + id + " not found");
        }

        this.badgeHolderRepository.delete(badgeHolderOpt.get());
    }

    @Override
    public void addBadgeToHolder(String azureOID, Badge badge) {
        if (azureOID == null || badge == null) {
            throw new BadRequestException("Azure OID and badge cannot be null");
        }

        Optional<BadgeHolder> badgeHolderOpt = this.badgeHolderRepository.findByAzureOIDOptional(azureOID);
        BadgeHolder badgeHolder;

        if (badgeHolderOpt.isEmpty()) {
            // Create new badge holder if it doesn't exist
            badgeHolder = new BadgeHolder(azureOID);
        } else {
            badgeHolder = badgeHolderOpt.get();
        }

        badgeHolder.badges.add(badge);

        if (badgeHolderOpt.isEmpty()) {
            this.badgeHolderRepository.persist(badgeHolder);
        } else {
            this.badgeHolderRepository.update(badgeHolder);
        }
    }

    private void verifyBadgeHolderIsValid(BadgeHolderDTO badgeHolderDTO) {
        if (badgeHolderDTO == null) {
            throw new BadRequestException("Badge holder data cannot be null");
        }

        String azureOID = badgeHolderDTO.getAzureOID();
        if (azureOID == null || azureOID.trim().isEmpty()) {
            throw new BadRequestException("Azure OID cannot be null or empty");
        }
    }
}
