package ch.supsi.mapper.question;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.question.QuestionDTO;

public class MultipleChoiceQuestionMapper extends QuestionMapper {
    @Override
    public QuestionDTO toDTO(Question question) {
        return super.toDTO(question);
    }

    @Override
    public Question toEntity(QuestionDTO dto) {
        return super.toEntity(dto);
    }
}
