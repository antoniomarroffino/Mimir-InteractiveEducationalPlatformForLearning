package ch.supsi.service.question;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;

import java.util.EnumMap;
import java.util.Map;

public class QuestionFactory {
    private static QuestionFactory instance;
    private final Map<QuestionType, QuestionCreationStrategy> strategies;

    private QuestionFactory() {
        strategies = new EnumMap<>(QuestionType.class);
        strategies.put(QuestionType.TRUE_FALSE, new TrueFalseQuestionStrategy());
    }

    public static QuestionFactory getInstance() {
        return instance == null ? instance = new QuestionFactory() : instance;
    }

    public Question createQuestion(QuestionType type) {
        QuestionCreationStrategy strategy = strategies.get(type);
        if (strategy == null) {
            throw new UnsupportedOperationException("Question type not supported: " + type);
        }
        return strategy.createQuestion();
    }
}