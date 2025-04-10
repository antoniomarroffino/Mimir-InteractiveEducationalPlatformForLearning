package ch.supsi.mapper.question;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.question.QuestionDTO;
import org.bson.types.ObjectId;

public abstract class AbstractQuestionMapper<E extends Question, D extends QuestionDTO> implements IBaseMapper<E, D> {

    protected void mapCommonFieldsQuestionToQuestionDTO(Question question, QuestionDTO dto) {
        dto.setId(question.id != null ? question.id.toString() : null);
        dto.setQuestionText(question.questionText);
        dto.setQuestionBankId(question.questionBankId);
    }

    protected void mapCommonFieldsQuestionDTOToQuestion(QuestionDTO dto, Question question) {
        if (dto.getId() != null) {
            question.id = new ObjectId(dto.getId());
        }
        question.questionText = dto.getQuestionText();
        question.questionBankId = dto.getQuestionBankId();
    }
}

