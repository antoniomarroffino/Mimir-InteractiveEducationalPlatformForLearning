package ch.supsi.mapper.response;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.dto.api.response.QuestionResponseDTO;
import org.bson.types.ObjectId;

public abstract class AbstractQuestionResponseMapper<E extends QuestionResponse, D extends QuestionResponseDTO> implements IBaseMapper<E, D> {

    protected void mapCommonFieldsResponseToResponseDTO(QuestionResponse response, QuestionResponseDTO dto) {
        dto.setId(response.id.toString());
        dto.setResponseType(response.responseType);
        dto.setQuestionId(response.questionId.toString());
        dto.setTimeSpent(response.timeSpent);
    }

    protected void mapCommonFieldsResponseDTOToResponse(QuestionResponseDTO dto, QuestionResponse response) {
        if (dto.getId() != null) {
            response.id = new ObjectId(dto.getId());
        }
        if (dto.getQuestionId() != null) {
            response.questionId = new ObjectId(dto.getQuestionId());
        }
        response.timeSpent = dto.getTimeSpent();
    }
}