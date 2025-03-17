package ch.supsi.service.quizpublication;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.repository.QuizPublicationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.Random;

@ApplicationScoped
public class QuizPublicationService implements IQuizPublicationService {

    @Inject
    QuizPublicationRepository quizPublicationRepository;

    private static final String CODE_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;

    @Override
    public QuizPublication publishQuiz(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        QuizPublication publication = new QuizPublication();
        publication.setCourseId(courseId);
        publication.setFolderId(folderId);
        publication.setQuizId(quizId);
        publication.setPublicationCode(generateUniqueCode());

        this.quizPublicationRepository.persist(publication);
        return publication;
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
        } while (this.quizPublicationRepository.findByCode(code).isPresent());

        return code;
    }
}
