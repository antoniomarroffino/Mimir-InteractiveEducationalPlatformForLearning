package ch.supsi.service.quizpublication;

import ch.supsi.mapper.QuizPublicationMapper;
import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.repository.QuizPublicationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.List;
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
        return quizPublicationRepository.findByCode(code);
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
        } while (this.quizPublicationRepository.findByCode(code) != null);

        return code;
    }
}