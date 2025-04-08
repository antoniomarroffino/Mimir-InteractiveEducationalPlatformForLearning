package ch.supsi.mapper.response;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.dto.api.response.QuestionResponseDTO;

public record QuestionResponseMapperHolder<E extends QuestionResponse, D extends QuestionResponseDTO>(
        IBaseMapper<E, D> mapper) {
}
