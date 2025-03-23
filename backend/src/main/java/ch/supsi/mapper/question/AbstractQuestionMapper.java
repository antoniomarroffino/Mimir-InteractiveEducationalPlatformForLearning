package ch.supsi.mapper.question;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.question.QuestionDTO;
import org.bson.types.ObjectId;

public abstract class AbstractQuestionMapper<E extends Question, D extends QuestionDTO> implements IBaseMapper<E, D> {

    protected void mapCommonFieldsQuestionToQuestionDTO(Question question, QuestionDTO dto) {
        dto.setId(question.getId().toString());
        dto.setQuestionText(question.getQuestionText());
        dto.setType(question.getType());
    }

    protected void mapCommonFieldsQuestionDTOToQuestion(QuestionDTO dto, Question question) {
        question.setId(new ObjectId(dto.getId()));
        question.setQuestionText(dto.getQuestionText());
    }
}

