package ch.supsi.service.quizattempt;

import ch.supsi.mapper.QuizAttemptMapper;
import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.repository.QuizAttemptRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.Collections;
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
        try {
            // Log dettagliato dei dati in ingresso
            System.out.println("Ricevuto QuizAttemptDTO:");
            System.out.println("QuizPublicationId: " + quizAttemptDTO.getQuizPublicationId());
            System.out.println("UserId: " + quizAttemptDTO.getUserId());
            System.out.println("StartedAt: " + quizAttemptDTO.getStartedAt());
            System.out.println("CompletedAt: " + quizAttemptDTO.getCompletedAt());

            if (quizAttemptDTO.getResponses() != null) {
                System.out.println("Numero di risposte: " + quizAttemptDTO.getResponses().size());
                quizAttemptDTO.getResponses().forEach(response -> {
                    System.out.println("Risposta - Tipo: " + response.getResponseType());
                    // Aggiungi altri dettagli specifici del tipo di risposta
                });
            } else {
                System.out.println("Nessuna risposta ricevuta");
            }

            // Permetti liste vuote
            if (quizAttemptDTO.getResponses() == null) {
                quizAttemptDTO.setResponses(Collections.emptyList());
            }

            QuizAttempt quizAttempt = this.quizAttemptMapper.toEntity(quizAttemptDTO);

            if (quizAttempt.startedAt == null) {
                quizAttempt.startedAt = LocalDateTime.now();
            }

            if (quizAttempt.completedAt == null) {
                quizAttempt.completedAt = LocalDateTime.now();
            }

            this.quizAttemptRepository.persist(quizAttempt);
            return this.quizAttemptMapper.toDTO(quizAttempt);
        } catch (Exception e) {
            // Log dell'eccezione completa
            e.printStackTrace();
            throw new InternalServerErrorException("Impossibile salvare il tentativo del quiz: " + e.getMessage(), e);
        }
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