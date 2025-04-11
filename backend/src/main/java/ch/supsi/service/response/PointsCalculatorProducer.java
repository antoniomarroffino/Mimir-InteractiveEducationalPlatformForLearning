package ch.supsi.service.response;

import ch.supsi.model.api.question.QuestionType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Produces;

import java.util.EnumMap;
import java.util.Map;

@ApplicationScoped
public class PointsCalculatorProducer {
    @Inject
    TrueFalsePointsCalculator trueFalseCalculator;

    @Inject
    MultipleChoicePointsCalculator multipleChoiceCalculator;

    @Produces
    @ApplicationScoped
    public Map<QuestionType, IPointsCalculator> produceCalculators() {
        Map<QuestionType, IPointsCalculator> calculators = new EnumMap<>(QuestionType.class);
        calculators.put(QuestionType.TRUE_FALSE, trueFalseCalculator);
        calculators.put(QuestionType.MULTIPLE_CHOICE, multipleChoiceCalculator);
        return calculators;
    }
}