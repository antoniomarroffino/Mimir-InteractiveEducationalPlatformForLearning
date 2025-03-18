package ch.supsi.mapper.question;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.question.builder.IQuestionDTOMapperBuilder;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.service.question.builder.IQuestionFactory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

@ApplicationScoped
public class QuestionMapper implements IBaseMapper<Question, QuestionDTO> {

    @Inject
    IQuestionDTOMapperBuilder questionDTOBuilder;

    @Inject
    IQuestionFactory questionFactory;

    @Override
    public QuestionDTO toDTO(Question question) {
        if (question == null) {
            return null;
        }

        try {
            if (question instanceof TrueFalseQuestion tfQuestion) {
                TrueFalseQuestionDTO dto = new TrueFalseQuestionDTO();
                dto.setId(question.getId().toString());
                dto.setQuestionText(question.getQuestionText());
                dto.setCorrectAnswer(tfQuestion.isCorrectAnswer());

                return dto;
            }

            if (question instanceof MultipleChoiceQuestion mcQuestion) {
                MultipleChoiceQuestionDTO dto = new MultipleChoiceQuestionDTO();
                dto.setId(question.getId().toString());
                dto.setQuestionText(question.getQuestionText());
                dto.setChoices(mcQuestion.getChoices());
                dto.setCorrectAnswerIndexes(mcQuestion.getCorrectAnswerIndexes());

                return dto;
            }

            QuestionDTO dto = new QuestionDTO();
            dto.setId(question.getId().toString());
            dto.setQuestionText(question.getQuestionText());
            dto.setType(question.getType());

            return dto;
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert Question to DTO", e);
        }
    }

    @Override
    public Question toEntity(QuestionDTO dto) {
        if (dto == null) {
            return null;
        }

        try {
            Question question = questionFactory.createQuestion(dto.getType());

            if (dto.getId() != null) {
                try {
                    question.setId(new ObjectId(dto.getId()));
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid ID format", e);
                }
            }

            question.setQuestionText(dto.getQuestionText());

            if (question instanceof TrueFalseQuestion tfQuestion && dto instanceof TrueFalseQuestionDTO trueFalseDTO) {
                tfQuestion.setCorrectAnswer(trueFalseDTO.getCorrectAnswer());
            }

            if (question instanceof MultipleChoiceQuestion mcQuestion && dto instanceof MultipleChoiceQuestionDTO multipleChoiceDTO) {
                mcQuestion.setChoices(multipleChoiceDTO.getChoices());
                mcQuestion.setCorrectAnswerIndexes(multipleChoiceDTO.getCorrectAnswerIndexes());
            }

            return question;
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert DTO to Question entity", e);
        }
    }
}