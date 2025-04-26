package ch.supsi.mapper.response.builder;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.response.MultipleChoiceQuestionResponseMapper;
import ch.supsi.mapper.response.QuestionResponseMapperHolder;
import ch.supsi.mapper.response.TrueFalseQuestionResponseMapper;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.dto.api.response.QuestionResponseDTO;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.EnumMap;
import java.util.Map;

@ApplicationScoped
public class QuestionResponseMapperBuilder implements IQuestionResponseMapperBuilder {
    private final Map<QuestionType, QuestionResponseMapperHolder<?, ?>> mapperMap;

    public QuestionResponseMapperBuilder() {
        this.mapperMap = new EnumMap<>(QuestionType.class);
        this.mapperMap.put(QuestionType.TRUE_FALSE, new QuestionResponseMapperHolder<>(new TrueFalseQuestionResponseMapper()));
        this.mapperMap.put(QuestionType.MULTIPLE_CHOICE, new QuestionResponseMapperHolder<>(new MultipleChoiceQuestionResponseMapper()));
    }

    @Override
    @SuppressWarnings("unchecked")
    public IBaseMapper<? extends QuestionResponse, ? extends QuestionResponseDTO> getQuestionResponseDTOMapper(QuestionType responseType) {
        QuestionResponseMapperHolder<? extends QuestionResponse, ? extends QuestionResponseDTO> questionResponseMapperHolder = this.mapperMap.get(responseType);
        if (questionResponseMapperHolder == null) {
            throw new UnsupportedOperationException("Question type not supported: " + responseType);
        }
        return this.mapperMap.get(responseType).mapper();
    }
}