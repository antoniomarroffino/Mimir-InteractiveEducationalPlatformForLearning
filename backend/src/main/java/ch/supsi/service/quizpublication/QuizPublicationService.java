package ch.supsi.service.quizpublication;

import ch.supsi.mapper.QuizPublicationMapper;
import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.repository.QuizPublicationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@ApplicationScoped
public class QuizPublicationService implements IQuizPublicationService {

    @Inject
    QuizPublicationRepository quizPublicationRepository;

    @Inject
    QuizPublicationMapper quizPublicationMapper;

    private static final String CODE_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;

    @Override
    public QuizPublicationDTO publishQuiz(QuizPublicationDTO quizPublicationDTO) {
        QuizPublication quizPublication = new QuizPublication(
                new ObjectId(quizPublicationDTO.getCourseId()),
                new ObjectId(quizPublicationDTO.getFolderId()),
                new ObjectId(quizPublicationDTO.getQuizId()),
                generateUniqueCode()
        );
        quizPublication.setPublished(true);
        this.quizPublicationRepository.persist(quizPublication);
        return this.quizPublicationMapper.toDTO(quizPublication);
    }

    @Override
    public QuizPublication getPublicationByReferences(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        return this.quizPublicationRepository.find(
                "courseId = ?1 and folderId = ?2 and quizId = ?3",
                courseId,
                folderId,
                quizId
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
    public QuizPublicationDTO updateQuizPublication(QuizPublicationDTO quizPublicationDTO) {
        ObjectId objectId = new ObjectId(quizPublicationDTO.getId());
        QuizPublication existingPublication = quizPublicationRepository.findById(objectId);
        if (existingPublication == null) {
            return null;
        }
        existingPublication.setCourseId(new ObjectId(quizPublicationDTO.getCourseId()));
        existingPublication.setFolderId(new ObjectId(quizPublicationDTO.getFolderId()));
        existingPublication.setQuizId(new ObjectId(quizPublicationDTO.getQuizId()));
        existingPublication.setPublished(quizPublicationDTO.isPublished());
        quizPublicationRepository.update(existingPublication);
        return quizPublicationMapper.toDTO(existingPublication);
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