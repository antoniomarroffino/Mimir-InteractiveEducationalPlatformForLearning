package ch.supsi.mapper;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.service.question.QuestionFactory;
import org.bson.types.ObjectId;

public class QuestionMapper implements BaseMapper<Question, QuestionDTO> {
    private static QuestionMapper instance;

    private QuestionMapper() {}

    public static QuestionMapper getInstance() {
        return instance == null ? instance = new QuestionMapper() : instance;
    }

    @Override
    public QuestionDTO toDTO(Question question) {
        if (question == null) {
            return null;
        }

        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId().toString());
        dto.setQuestionText(question.getQuestionText());
        dto.setType(question.getType());

        if (question instanceof TrueFalseQuestion) {
            dto.setCorrectAnswer(((TrueFalseQuestion) question).isCorrectAnswer());
        }

        return dto;
    }

    @Override
    public Question toEntity(QuestionDTO dto) {
        if (dto == null) {
            return null;
        }

        Question question = QuestionFactory.getInstance().createQuestion(dto.getType());

        if (dto.getId() != null) {
            question.setId(new ObjectId(dto.getId()));
        }
        question.setQuestionText(dto.getQuestionText());

        if (question instanceof TrueFalseQuestion && dto.getCorrectAnswer() != null) {
            ((TrueFalseQuestion) question).setCorrectAnswer(dto.getCorrectAnswer());
        }

        return question;
    }
}