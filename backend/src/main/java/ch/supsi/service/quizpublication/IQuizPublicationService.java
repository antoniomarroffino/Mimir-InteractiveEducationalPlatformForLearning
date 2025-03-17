package ch.supsi.service.quizpublication;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.api.user.User;
import org.bson.types.ObjectId;

public interface IQuizPublicationService {
    QuizPublication publishQuiz(ObjectId courseId, ObjectId folderId, ObjectId quizId, User user);
}
