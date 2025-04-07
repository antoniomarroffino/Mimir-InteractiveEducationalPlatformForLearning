package ch.supsi.service.quizattempt;

import ch.supsi.mapper.quizAttempt.QuizAttemptMapper;
import ch.supsi.mapper.quizAttempt.facade.IQuizAttemptMapperFacade;
import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.repository.QuizAttemptRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizAttemptService implements IQuizAttemptService {

    @Inject
    QuizAttemptRepository quizAttemptRepository;

    @Inject
    IQuizAttemptMapperFacade quizAttemptMapperFacade;

    @Override
    public QuizAttemptDTO createQuizAttempt(QuizAttemptDTO quizAttemptDTO) {
        this.verifyQuizAttemptIsValid(quizAttemptDTO);

        QuizAttempt quizAttempt = this.quizAttemptMapperFacade.toEntity(quizAttemptDTO);
        quizAttempt.completedAt = LocalDateTime.now();

        this.quizAttemptRepository.persist(quizAttempt);
        return this.quizAttemptMapperFacade.toDTO(quizAttempt);
    }

    @Override
    public QuizAttemptDTO getQuizAttemptById(ObjectId attemptId) {
        QuizAttempt quizAttempt = this.findQuizAttemptById(attemptId);
        return this.quizAttemptMapperFacade.toDTO(quizAttempt);
    }

    @Override
    public List<QuizAttemptDTO> getQuizAttemptsByUser(String userAzureOID) {
        this.verifyUserOIDIsValid(userAzureOID);

        return this.quizAttemptRepository.findByUserAzureOID(userAzureOID).stream()
                .map(this.quizAttemptMapperFacade::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizAttemptDTO> getQuizAttemptsByPublication(ObjectId publicationId) {
        if (publicationId == null) {
            throw new BadRequestException("Publication ID cannot be null");
        }

        return this.quizAttemptRepository.findByPublicationId(publicationId).stream()
                .map(this.quizAttemptMapperFacade::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizAttemptDTO> getQuizAttemptsByPublicationAndQuestion(ObjectId publicationId, ObjectId questionId) {
        if (publicationId == null || questionId == null) {
            throw new BadRequestException("Publication ID and Question ID cannot be null");
        }

        return this.quizAttemptRepository.findByPublicationIdAndQuestionId(publicationId, questionId).stream()
                .map(this.quizAttemptMapperFacade::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void assignBadge(ObjectId attemptId, BadgeType badgeType, String teacherAzureOid) {
        if (attemptId == null || badgeType == null) {
            throw new BadRequestException("Attempt ID and badge type cannot be null");
        }

        this.verifyUserOIDIsValid(teacherAzureOid);

        QuizAttempt quizAttempt = this.findQuizAttemptById(attemptId);

        this.verifyBadgeIsUnique(quizAttempt, badgeType);

        quizAttempt.badges.add(new Badge(badgeType, teacherAzureOid));
        this.quizAttemptRepository.update(quizAttempt);
    }

    private void verifyBadgeIsUnique(QuizAttempt quizAttempt, BadgeType badgeType) {
        boolean badgeExists = quizAttempt.badges.stream()
                .anyMatch(badge -> badge.type.equals(badgeType));

        if (badgeExists)
            throw new BadRequestException("Badge " + badgeType + " already assigned to this attempt");
    }

    private void verifyUserOIDIsValid(String userOID) {
        if(userOID == null || userOID.isEmpty())
            throw new InternalServerErrorException("User Azure OID cannot be null");
    }

    private QuizAttempt findQuizAttemptById(ObjectId quizAttemptId) {
        return this.quizAttemptRepository
                .findByIdOptional(quizAttemptId)
                .orElseThrow(() -> new NotFoundException("Quiz attempt with id " + quizAttemptId + " not found"));
    }

    private void verifyQuizAttemptIsValid(QuizAttemptDTO quizAttemptDTO) {
        if (quizAttemptDTO == null) {
            throw new BadRequestException("Quiz attempt data cannot be null");
        }

        if (quizAttemptDTO.getQuizPublicationId() == null) {
            throw new BadRequestException("Quiz publication ID cannot be null");
        }

        if (quizAttemptDTO.getResponses() == null || quizAttemptDTO.getResponses().isEmpty()) {
            throw new BadRequestException("Quiz responses cannot be null or empty");
        }
    }
}