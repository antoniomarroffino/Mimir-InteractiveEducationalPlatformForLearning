package ch.supsi.mapper.response;

import ch.supsi.model.api.response.TrueFalseQuestionResponse;
import ch.supsi.model.dto.api.response.TrueFalseQuestionResponseDTO;
import org.bson.types.ObjectId;

public class TrueFalseQuestionResponseMapper extends AbstractQuestionResponseMapper<TrueFalseQuestionResponse, TrueFalseQuestionResponseDTO> {
    @Override
    public TrueFalseQuestionResponseDTO toDTO(TrueFalseQuestionResponse trueFalseResponse) {
        if (trueFalseResponse == null) {
            return null;
        }

        TrueFalseQuestionResponseDTO dto = new TrueFalseQuestionResponseDTO();
        super.mapCommonFieldsResponseToResponseDTO(trueFalseResponse, dto);

        dto.setSelectedAnswer(trueFalseResponse.selectedAnswer);
        return dto;
    }

    @Override
    public TrueFalseQuestionResponse toEntity(TrueFalseQuestionResponseDTO dto) {
        if (dto == null) {
            return null;
        }

        TrueFalseQuestionResponse response = new TrueFalseQuestionResponse();
        super.mapCommonFieldsResponseDTOToResponse(dto, response);

        response.selectedAnswer = dto.getSelectedAnswer();
        return response;
    }
}