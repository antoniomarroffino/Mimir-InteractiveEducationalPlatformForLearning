package ch.supsi.mapper.question.builder;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.question.MultipleChoiceQuestionMapper;
import ch.supsi.mapper.question.QuestionMapperHolder;
import ch.supsi.mapper.question.TrueFalseQuestionMapper;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.EnumMap;
import java.util.Map;

@ApplicationScoped
public class QuestionMapperBuilder implements IQuestionMapperBuilder {
    private final Map<QuestionType, QuestionMapperHolder<?, ?>> mapperMap;

    public QuestionMapperBuilder() {
        this.mapperMap = new EnumMap<>(QuestionType.class);
        this.mapperMap.put(QuestionType.TRUE_FALSE, new QuestionMapperHolder<>(new TrueFalseQuestionMapper()));
        this.mapperMap.put(QuestionType.MULTIPLE_CHOICE, new QuestionMapperHolder<>(new MultipleChoiceQuestionMapper()));
    }

    @Override
    @SuppressWarnings("unchecked")
    public IBaseMapper<? extends Question, ? extends QuestionDTO> getQuestionDTOMapper(QuestionType questionType) {
        QuestionMapperHolder<? extends Question, ? extends QuestionDTO> questionMapperHolder = this.mapperMap.get(questionType);
        if (questionMapperHolder == null) {
            throw new UnsupportedOperationException("Question type not supported: " + questionType);
        }
        return questionMapperHolder.mapper();
    }
}