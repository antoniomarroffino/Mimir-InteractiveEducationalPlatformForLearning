package ch.supsi.mapper.response;

import ch.supsi.model.api.response.MultipleChoiceQuestionResponse;
import ch.supsi.model.dto.api.response.MultipleChoiceQuestionResponseDTO;
import org.bson.types.ObjectId;

public class MultipleChoiceQuestionResponseMapper extends AbstractQuestionResponseMapper<MultipleChoiceQuestionResponse, MultipleChoiceQuestionResponseDTO> {
    @Override
    public MultipleChoiceQuestionResponseDTO toDTO(MultipleChoiceQuestionResponse multipleChoiceResponse) {
        if (multipleChoiceResponse == null) {
            return null;
        }

        MultipleChoiceQuestionResponseDTO dto = new MultipleChoiceQuestionResponseDTO();
        super.mapCommonFieldsResponseToResponseDTO(multipleChoiceResponse, dto);
        dto.setSelectedAnswerIndexes(multipleChoiceResponse.selectedAnswerIndexes);
        return dto;
    }

    @Override
    public MultipleChoiceQuestionResponse toEntity(MultipleChoiceQuestionResponseDTO dto) {
        if (dto == null) {
            return null;
        }

        MultipleChoiceQuestionResponse response = new MultipleChoiceQuestionResponse(
                dto.getQuestionId() != null ? new ObjectId(dto.getQuestionId()) : null
        );
        super.mapCommonFieldsResponseDTOToResponse(dto, response);
        response.selectedAnswerIndexes = dto.getSelectedAnswerIndexes();
        return response;
    }
}
