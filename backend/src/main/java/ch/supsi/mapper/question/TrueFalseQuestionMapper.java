package ch.supsi.mapper.question;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;

public class TrueFalseQuestionMapper extends AbstractQuestionMapper<TrueFalseQuestion, TrueFalseQuestionDTO> {
    @Override
    public TrueFalseQuestionDTO toDTO(TrueFalseQuestion trueFalseQuestion) {
        if (trueFalseQuestion == null) {
            return null;
        }

        TrueFalseQuestionDTO trueFalseQuestionDTO = new TrueFalseQuestionDTO();
        super.mapCommonFieldsQuestionToQuestionDTO(trueFalseQuestion, trueFalseQuestionDTO);
        trueFalseQuestionDTO.setCorrectAnswer(trueFalseQuestion.correctAnswer);
        return trueFalseQuestionDTO;
    }

    @Override
    public TrueFalseQuestion toEntity(TrueFalseQuestionDTO trueFalseQuestionDTO) {
        if (trueFalseQuestionDTO == null) {
            return null;
        }

        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion();
        super.mapCommonFieldsQuestionDTOToQuestion(trueFalseQuestionDTO, trueFalseQuestion);
        trueFalseQuestion.correctAnswer = trueFalseQuestionDTO.getCorrectAnswer();
        return trueFalseQuestion;
    }
}
