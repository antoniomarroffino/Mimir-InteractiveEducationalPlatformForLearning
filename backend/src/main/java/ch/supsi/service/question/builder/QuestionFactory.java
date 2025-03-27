package ch.supsi.service.question.builder;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.service.question.strategy.IQuestionCreationStrategy;
import ch.supsi.service.question.strategy.MultipleChoiceQuestionStrategy;
import ch.supsi.service.question.strategy.TrueFalseQuestionStrategy;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.EnumMap;
import java.util.Map;

@ApplicationScoped
public class QuestionFactory implements IQuestionFactory {
    private final Map<QuestionType, IQuestionCreationStrategy<? extends Question, ? extends QuestionDTO>> strategies;

    public QuestionFactory() {
        this.strategies = new EnumMap<>(QuestionType.class);
        this.strategies.put(QuestionType.TRUE_FALSE, new TrueFalseQuestionStrategy());
        this.strategies.put(QuestionType.MULTIPLE_CHOICE, new MultipleChoiceQuestionStrategy());
    }

    @Override
    @SuppressWarnings("unchecked")
    public <E extends Question, D extends QuestionDTO> IQuestionCreationStrategy<E, D> getStrategy(QuestionType type) {
        IQuestionCreationStrategy<? extends Question, ? extends QuestionDTO> strategy = this.strategies.get(type);
        if (strategy == null) {
            throw new UnsupportedOperationException("Question type not supported: " + type);
        }
        return (IQuestionCreationStrategy<E, D>) strategy;
    }
}