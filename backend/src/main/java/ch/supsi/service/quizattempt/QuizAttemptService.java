package ch.supsi.service.quizattempt;

import ch.supsi.mapper.QuizAttemptMapper;
import ch.supsi.model.api.QuizAttempt;
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
    QuizAttemptMapper quizAttemptMapper;

    @Override
    public QuizAttemptDTO createQuizAttempt(QuizAttemptDTO quizAttemptDTO) {
        this.verifyQuizAttemptIsValid(quizAttemptDTO);

        QuizAttempt quizAttempt = this.quizAttemptMapper.toEntity(quizAttemptDTO);
        quizAttempt.startedAt = LocalDateTime.now();
        quizAttempt.completedAt = LocalDateTime.now();

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