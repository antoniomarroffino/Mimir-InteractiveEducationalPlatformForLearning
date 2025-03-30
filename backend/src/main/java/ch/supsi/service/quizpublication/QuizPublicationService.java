package ch.supsi.service.quizpublication;

import ch.supsi.mapper.QuizPublicationMapper;
import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.repository.QuizPublicationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizPublicationService implements IQuizPublicationService {

    private static final String CODE_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;

    @Inject
    QuizPublicationRepository quizPublicationRepository;

    @Inject
    QuizPublicationMapper quizPublicationMapper;

    @Override
    public QuizPublicationDTO publishQuiz(QuizPublication quizPublication) {
        QuizPublication newQuizPublication = new QuizPublication(
                new ObjectId(quizPublication.courseId.toString()),
                new ObjectId(quizPublication.folderId.toString()),
                new ObjectId(quizPublication.quizId.toString()),
                generateUniqueCode()
        );
        newQuizPublication.published = true;
        newQuizPublication.createdAt = LocalDateTime.now();
        this.quizPublicationRepository.persist(newQuizPublication);
        return this.quizPublicationMapper.toDTO(newQuizPublication);
    }

    @Override
    public QuizPublicationDTO getQuizPublicationById(String publicationID) {
        Optional<QuizPublication> quizPublicationOpt = this.quizPublicationRepository.findByIdOptional(new ObjectId(publicationID));
        if (quizPublicationOpt.isEmpty()) {
            throw new NotFoundException("Quiz publication with id " + publicationID + " not found");
        }

        return this.quizPublicationMapper.toDTO(quizPublicationOpt.get());
    }

    @Override
    public QuizPublication getPublicationByReferences(String courseId, String folderId, String quizId) {
        return this.quizPublicationRepository.find(
                "courseId = ?1 and folderId = ?2 and quizId = ?3",
                new ObjectId(courseId),
                new ObjectId(folderId),
                new ObjectId(quizId)
        ).firstResult();
    }

    @Override
    public List<QuizPublication> getAllPublications() {
        return this.quizPublicationRepository.listAll();
    }

    @Override
    public QuizPublication getPublicationByCode(String code) {
        Optional<QuizPublication> quizPublicationOpt = this.quizPublicationRepository.findByCodeOptional(code);
        if (quizPublicationOpt.isEmpty()) {
            throw new NotFoundException("Quiz publication with code " + code + " not found");
        }
        return quizPublicationOpt.get();
    }

    @Override
    public QuizPublicationDTO updateQuizPublication(QuizPublication quizPublication) {
        Optional<QuizPublication> quizPublicationOpt = this.quizPublicationRepository.findByIdOptional(quizPublication.id);
        if (quizPublicationOpt.isEmpty()) {
            throw new NotFoundException("Quiz publication with id " + quizPublication.id + " not found");
        }

        QuizPublication existingPublication = quizPublicationOpt.get();
        existingPublication.courseId = quizPublication.courseId;
        existingPublication.folderId = quizPublication.folderId;
        existingPublication.quizId = quizPublication.quizId;
        existingPublication.published = quizPublication.published;
        existingPublication.anonymous = quizPublication.anonymous;

        quizPublicationRepository.update(existingPublication);
        return quizPublicationMapper.toDTO(existingPublication);
    }

    @Override
    public QuizPublicationDTO deactivateQuizPublication(String publicationID) {
        Optional<QuizPublication> quizPublicationOpt = this.quizPublicationRepository.findByIdOptional(new ObjectId(publicationID));
        if (quizPublicationOpt.isEmpty()) {
            throw new NotFoundException("Quiz publication with id " + publicationID + " not found");
        }

        QuizPublication quizPublication = quizPublicationOpt.get();
        quizPublication.published = false;
        quizPublication.closedAt = LocalDateTime.now();
        this.quizPublicationRepository.update(quizPublication);
        return this.quizPublicationMapper.toDTO(quizPublication);
    }

    @Override
    public boolean deleteQuizPublication(String id) {
        try {
            ObjectId objectId = new ObjectId(id);

            QuizPublication publication = quizPublicationRepository.findById(objectId);

            if (publication == null) {
                return false;
            }

            quizPublicationRepository.delete(publication);
            return true;
        } catch (Exception e) {
            System.err.println("Errore durante l'eliminazione della pubblicazione: " + e.getMessage());
            return false;
        }
    }

    @Override
    public List<QuizPublicationDTO> getPublicationsByQuizId(String quizId) {
        ObjectId quizObjectId = new ObjectId(quizId);
        List<QuizPublication> publications = this.quizPublicationRepository.findPublicationsByQuizId(quizObjectId);
        if (publications.isEmpty()) {
            throw new NotFoundException("No publications found for quiz with id " + quizId);
        }
        return publications.stream()
                .map(this.quizPublicationMapper::toDTO)
                .collect(Collectors.toList());
    }

    private String generateUniqueCode() {
        Random random = new Random();
        String code;
        do {
            StringBuilder sb = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                sb.append(CODE_CHARACTERS.charAt(random.nextInt(CODE_CHARACTERS.length())));
            }
            code = sb.toString();
        } while (this.quizPublicationRepository.findByCodeOptional(code).isPresent());

        return code;
    }
}