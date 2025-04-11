package ch.supsi.service.quizattempt;

import ch.supsi.mapper.QuizAttemptMapper;
import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.repository.QuestionRepository;
import ch.supsi.repository.QuizAttemptRepository;
import ch.supsi.service.response.IPointsCalculator;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizAttemptService implements IQuizAttemptService {

    @Inject
    QuizAttemptRepository quizAttemptRepository;

    @Inject
    QuizAttemptMapper quizAttemptMapper;

    @Inject
    QuestionRepository questionRepository;

    @Inject
    Map<QuestionType, IPointsCalculator> pointsCalculators;

    @Override
    public QuizAttemptDTO createQuizAttempt(QuizAttemptDTO quizAttemptDTO) {
        this.verifyQuizAttemptIsValid(quizAttemptDTO);

        QuizAttempt quizAttempt = this.quizAttemptMapper.toEntity(quizAttemptDTO);
        quizAttempt.startedAt = LocalDateTime.now();
        quizAttempt.completedAt = LocalDateTime.now();

        calculateAndAssignPoints(quizAttempt);

        this.quizAttemptRepository.persist(quizAttempt);
        return this.quizAttemptMapper.toDTO(quizAttempt);
    }

    @Override
    public QuizAttemptDTO getQuizAttemptById(ObjectId attemptId) {
        Optional<QuizAttempt> quizAttemptOpt = this.quizAttemptRepository.findByIdOptional(attemptId);
        if (quizAttemptOpt.isEmpty()) {
            throw new NotFoundException("Quiz attempt " + attemptId + " not found");
        }
        return this.quizAttemptMapper.toDTO(quizAttemptOpt.get());
    }

    @Override
    public List<QuizAttemptDTO> getQuizAttemptsByUser(String userAzureOID) {
        if (userAzureOID == null) {
            throw new InternalServerErrorException("User Azure OID cannot be null");
        }

        return this.quizAttemptRepository.findByUserAzureOID(userAzureOID).stream()
                .map(this.quizAttemptMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizAttemptDTO> getQuizAttemptsByPublication(ObjectId publicationId) {
        if (publicationId == null) {
            throw new InternalServerErrorException("Publication ID cannot be null");
        }

        return this.quizAttemptRepository.findByPublicationId(publicationId).stream()
                .map(this.quizAttemptMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizAttemptDTO> getQuizAttemptsByPublicationAndQuestion(ObjectId publicationId, ObjectId questionId) {
        if (publicationId == null || questionId == null) {
            throw new InternalServerErrorException("Publication ID and Question ID cannot be null");
        }

        return this.quizAttemptRepository.findByPublicationIdAndQuestionId(publicationId, questionId).stream()
                .map(this.quizAttemptMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void assignBadge(ObjectId attemptId, BadgeType badgeType, String teacherAzureOid) {
        if (attemptId == null || badgeType == null || teacherAzureOid == null) {
            throw new BadRequestException("Attempt ID, badge type and teacher ID cannot be null");
        }

        Optional<QuizAttempt> quizAttemptOpt = this.quizAttemptRepository.findByIdOptional(attemptId);
        if (quizAttemptOpt.isEmpty()) {
            throw new NotFoundException("Quiz attempt " + attemptId + " not found");
        }

        QuizAttempt attempt = quizAttemptOpt.get();

        boolean badgeExists = attempt.badges.stream()
                .anyMatch(badge -> badge.type == badgeType);

        if (badgeExists) {
            throw new BadRequestException("Badge " + badgeType + " already assigned to this attempt");
        }

        attempt.badges.add(new Badge(badgeType, teacherAzureOid));
        this.quizAttemptRepository.update(attempt);
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

    private void calculateAndAssignPoints(QuizAttempt quizAttempt) {
        for (QuestionResponse response : quizAttempt.responses) {
            Question question = questionRepository.findById(response.questionId);

            if (question == null) {
                throw new NotFoundException("Question not found: " + response.questionId);
            }

            IPointsCalculator calculator = pointsCalculators.get(response.responseType);
            if (calculator == null) {
                throw new IllegalStateException("No points calculator found for response type: " + response.responseType);
            }

            response.earnedPoints = calculator.calculatePoints(response, question);
        }
    }


}