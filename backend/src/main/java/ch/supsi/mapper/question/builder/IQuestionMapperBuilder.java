package ch.supsi.mapper.question.builder;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;

public interface IQuestionMapperBuilder {
    <E extends Question, D extends QuestionDTO> IBaseMapper<E, D> getQuestionDTOMapper(QuestionType questionType);
}
