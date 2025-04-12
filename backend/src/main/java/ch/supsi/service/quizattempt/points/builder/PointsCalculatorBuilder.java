package ch.supsi.service.quizattempt.points.builder;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.service.quizattempt.points.strategy.IPointsCalculatorStrategy;
import ch.supsi.service.quizattempt.points.strategy.MultipleChoicePointsCalculatorStrategy;
import ch.supsi.service.quizattempt.points.strategy.TrueFalsePointsCalculatorStrategy;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.EnumMap;
import java.util.Map;

@ApplicationScoped
public class PointsCalculatorBuilder implements IPointsCalculatorBuilder {
    private final Map<QuestionType, IPointsCalculatorStrategy<? extends QuestionResponse, ? extends Question>> pointsCalculators;

    public PointsCalculatorBuilder() {
        this.pointsCalculators = new EnumMap<>(QuestionType.class);
        this.pointsCalculators.put(QuestionType.TRUE_FALSE, new TrueFalsePointsCalculatorStrategy());
        this.pointsCalculators.put(QuestionType.MULTIPLE_CHOICE, new MultipleChoicePointsCalculatorStrategy());
    }

    @Override
    @SuppressWarnings("unchecked")
    public <E extends QuestionResponse, D extends Question> IPointsCalculatorStrategy<E, D> getPointsCalculator(QuestionType questionType) {
        IPointsCalculatorStrategy<? extends QuestionResponse, ? extends Question> pointsCalculator = this.pointsCalculators.get(questionType);
        if (pointsCalculator == null) {
            throw new UnsupportedOperationException("Question type not supported: " + questionType);
        }
        return (IPointsCalculatorStrategy<E, D>) pointsCalculator;
    }
}