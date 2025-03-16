package ch.supsi.service.question.builder;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.service.question.strategy.MultipleChoiceQuestionStrategy;
import ch.supsi.service.question.strategy.QuestionCreationStrategy;
import ch.supsi.service.question.strategy.TrueFalseQuestionStrategy;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.EnumMap;
import java.util.Map;

@ApplicationScoped
public class QuestionFactory implements IQuestionFactory {
    private final Map<QuestionType, QuestionCreationStrategy> strategies;

    public QuestionFactory() {
        this.strategies = new EnumMap<>(QuestionType.class);
        this.strategies.put(QuestionType.TRUE_FALSE, new TrueFalseQuestionStrategy());
        this.strategies.put(QuestionType.MULTIPLE_CHOICE, new MultipleChoiceQuestionStrategy());
    }

    @Override
    public Question createQuestion(QuestionType type) {
        QuestionCreationStrategy strategy = this.strategies.get(type);
        if (strategy == null) {
            throw new UnsupportedOperationException("Question type not supported: " + type);
        }
        return strategy.createQuestion();
    }

    @Override
    public QuestionDTO createQuestionTemplate(QuestionType type) {
        return this.getStrategy(type).createQuestionTemplate();
    }

    private QuestionCreationStrategy getStrategy(QuestionType type) {
        QuestionCreationStrategy strategy = this.strategies.get(type);
        if (strategy == null) {
            throw new UnsupportedOperationException("Question type not supported: " + type);
        }
        return strategy;
    }
}