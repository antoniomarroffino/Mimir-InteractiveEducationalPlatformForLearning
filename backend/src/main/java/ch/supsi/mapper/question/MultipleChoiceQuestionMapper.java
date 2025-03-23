package ch.supsi.mapper.question;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;


public class MultipleChoiceQuestionMapper extends AbstractQuestionMapper<MultipleChoiceQuestion, MultipleChoiceQuestionDTO> {

    @Override
    public MultipleChoiceQuestionDTO toDTO(MultipleChoiceQuestion multipleChoiceQuestion) {
        if(multipleChoiceQuestion == null) {
            return null;
        }

        MultipleChoiceQuestionDTO multipleChoiceQuestionDTO = new MultipleChoiceQuestionDTO();
        super.mapCommonFieldsQuestionToQuestionDTO(multipleChoiceQuestion, multipleChoiceQuestionDTO);
        multipleChoiceQuestionDTO.setChoices(multipleChoiceQuestion.getChoices());
        multipleChoiceQuestionDTO.setCorrectAnswerIndexes(multipleChoiceQuestion.getCorrectAnswerIndexes());
        return multipleChoiceQuestionDTO;
    }

    @Override
    public MultipleChoiceQuestion toEntity(MultipleChoiceQuestionDTO multipleChoiceQuestionDTO) {
        if(multipleChoiceQuestionDTO == null) {
            return null;
        }
        MultipleChoiceQuestion multipleChoiceQuestion = new MultipleChoiceQuestion();
        super.mapCommonFieldsQuestionDTOToQuestion(multipleChoiceQuestionDTO, multipleChoiceQuestion);
        multipleChoiceQuestion.setChoices(multipleChoiceQuestionDTO.getChoices());
        multipleChoiceQuestion.setCorrectAnswerIndexes(multipleChoiceQuestionDTO.getCorrectAnswerIndexes());
        return multipleChoiceQuestion;
    }
}
