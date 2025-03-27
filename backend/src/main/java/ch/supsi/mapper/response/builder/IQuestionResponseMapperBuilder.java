package ch.supsi.mapper.response.builder;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.api.response.ResponseType;
import ch.supsi.model.dto.api.response.QuestionResponseDTO;

public interface IQuestionResponseMapperBuilder {
    <E extends QuestionResponse, D extends QuestionResponseDTO> IBaseMapper<E, D> getQuestionResponseDTOMapper(ResponseType responseType);
}
