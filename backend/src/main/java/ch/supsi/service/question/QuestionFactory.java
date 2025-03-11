package ch.supsi.service.question;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.EnumMap;
import java.util.Map;

@ApplicationScoped
public class QuestionFactory {
    private final Map<QuestionType, QuestionCreationStrategy> strategies;

    public QuestionFactory() {
        strategies = new EnumMap<>(QuestionType.class);
        strategies.put(QuestionType.TRUE_FALSE, new TrueFalseQuestionStrategy());
    }

    public Question createQuestion(QuestionType type) {
        QuestionCreationStrategy strategy = strategies.get(type);
        if (strategy == null) {
            throw new UnsupportedOperationException("Question type not supported: " + type);
        }
        return strategy.createQuestion();
    }

    public QuestionDTO createQuestionTemplate(QuestionType type) {
        return getStrategy(type).createQuestionTemplate();
    }

    private QuestionCreationStrategy getStrategy(QuestionType type) {
        QuestionCreationStrategy strategy = strategies.get(type);
        if (strategy == null) {
            throw new UnsupportedOperationException("Question type not supported: " + type);
        }
        return strategy;
    }
}