package ch.supsi.mapper.question;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.question.QuestionDTO;

public record QuestionMapperHolder<E extends Question, D extends QuestionDTO>(IBaseMapper<E, D> mapper) {
}


