package ch.supsi.service.quizpublication;

import ch.supsi.model.dto.api.QuizPublicationDTO;

public interface IQuizPublicationService {
    QuizPublicationDTO publishQuiz(QuizPublicationDTO quizPublicationDTO);
}
