package ch.supsi.service;

import ch.supsi.model.api.Question;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class QuestionService {
    public List<Question> getAllQuestions() {
        try {
            return Question.listAll();
        } catch (Exception e) {
            throw new RuntimeException("Errore nel recupero delle domande", e);
        }
    }

    public Question createQuestion(Question question) {
        try {
            question.persist();
            return question;
        } catch (Exception e) {
            throw new RuntimeException("Errore nella creazione della domanda", e);
        }
    }
}
