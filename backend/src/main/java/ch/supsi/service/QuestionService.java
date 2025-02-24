package ch.supsi.service;

import ch.supsi.model.Question;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class QuestionService {
    public List<Question> getAllQuestions() {
        try {
            return Question.listAll();
        } catch (Exception e) {
            e.printStackTrace(); // Per debug
            throw new RuntimeException("Errore nel recupero delle domande", e);
        }
    }

    @Transactional
    public Question createQuestion(Question question) {
        try {
            question.persist();
            return question;
        } catch (Exception e) {
            e.printStackTrace(); // Per debug
            throw new RuntimeException("Errore nella creazione della domanda", e);
        }
    }
}
