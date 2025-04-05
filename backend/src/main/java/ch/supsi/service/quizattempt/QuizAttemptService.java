package ch.supsi.service.quizattempt;

import ch.supsi.mapper.QuizAttemptMapper;
import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.repository.QuizAttemptRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
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
        QuizAttempt quizAttempt = this.quizAttemptMapper.toEntity(quizAttemptDTO);

        if (quizAttempt.startedAt == null) {
            quizAttempt.startedAt = LocalDateTime.now();
        }

        if (quizAttempt.completedAt == null) {
            quizAttempt.completedAt = LocalDateTime.now();
        }

        this.quizAttemptRepository.persist(quizAttempt);
        return this.quizAttemptMapper.toDTO(quizAttempt);
    }

    @Override
    public QuizAttemptDTO getQuizAttemptById(ObjectId attemptId) {
        Optional<QuizAttempt> quizAttemptOpt = this.quizAttemptRepository.findByIdOptional(attemptId);

        if (quizAttemptOpt.isEmpty()) {
            throw new NotFoundException("Quiz attempt with id " + attemptId + " not found");
        }

        return this.quizAttemptMapper.toDTO(quizAttemptOpt.get());
    }

    @Override
    public List<QuizAttemptDTO> getQuizAttemptsByUser(ObjectId userId) {
        List<QuizAttempt> attempts = this.quizAttemptRepository.find(
                "userId = ?1",
                userId
        ).list();

        return attempts.stream()
                .map(this.quizAttemptMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizAttemptDTO> getQuizAttemptsByPublication(ObjectId publicationId) {
        List<QuizAttempt> attempts = this.quizAttemptRepository.find(
                "quizPublicationId = ?1",
                publicationId
        ).list();

        return attempts.stream()
                .map(this.quizAttemptMapper::toDTO)
                .collect(Collectors.toList());
    }
}