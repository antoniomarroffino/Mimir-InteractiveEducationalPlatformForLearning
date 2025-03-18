package ch.supsi.mapper.question.builder;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.question.MultipleChoiceQuestionMapper;
import ch.supsi.mapper.question.TrueFalseQuestionMapper;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;

import java.util.EnumMap;
import java.util.Map;

public class QuestionDTOMapperBuilder implements IQuestionDTOMapperBuilder {
    private final Map<QuestionType, IBaseMapper<? extends Question,? extends QuestionDTO>> mapperMap;

    public QuestionDTOMapperBuilder() {
        this.mapperMap = new EnumMap<>(QuestionType.class);
        this.mapperMap.put(QuestionType.TRUE_FALSE, new TrueFalseQuestionMapper());
        this.mapperMap.put(QuestionType.MULTIPLE_CHOICE, new MultipleChoiceQuestionMapper());
    }
}
