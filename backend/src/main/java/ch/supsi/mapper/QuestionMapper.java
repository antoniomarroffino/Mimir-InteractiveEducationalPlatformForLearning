package ch.supsi.mapper;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.service.question.QuestionFactory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class QuestionMapper implements BaseMapper<Question, QuestionDTO> {

    private static final Logger logger = LoggerFactory.getLogger(QuestionMapper.class);

    @Inject
    QuestionFactory questionFactory;

    @Override
    public QuestionDTO toDTO(Question question) {
        if (question == null) {
            logger.warn("Attempting to convert null question to DTO");
            return null;
        }

        try {
            if (question instanceof TrueFalseQuestion tfQuestion) {
                TrueFalseQuestionDTO dto = new TrueFalseQuestionDTO();
                dto.setId(question.getId().toString());
                dto.setQuestionText(question.getQuestionText());
                dto.setCorrectAnswer(tfQuestion.isCorrectAnswer());

                logger.debug("Converted TrueFalseQuestion to DTO: {}", dto);
                return dto;
            }

            if (question instanceof MultipleChoiceQuestion mcQuestion) {
                MultipleChoiceQuestionDTO dto = new MultipleChoiceQuestionDTO();
                dto.setId(question.getId().toString());
                dto.setQuestionText(question.getQuestionText());
                dto.setChoices(mcQuestion.getChoices());
                dto.setCorrectAnswerIndexes(mcQuestion.getCorrectAnswerIndexes());

                logger.debug("Converted MultipleChoiceQuestion to DTO: {}", dto);
                return dto;
            }

            QuestionDTO dto = new QuestionDTO();
            dto.setId(question.getId().toString());
            dto.setQuestionText(question.getQuestionText());
            dto.setType(question.getType());

            logger.debug("Converted generic Question to DTO: {}", dto);
            return dto;
        } catch (Exception e) {
            logger.error("Error converting Question to DTO", e);
            throw new RuntimeException("Failed to convert Question to DTO", e);
        }
    }

    @Override
    public Question toEntity(QuestionDTO dto) {
        if (dto == null) {
            logger.warn("Attempting to convert null DTO to Question entity");
            return null;
        }

        try {
            Question question = questionFactory.createQuestion(dto.getType());

            if (dto.getId() != null) {
                try {
                    question.setId(new ObjectId(dto.getId()));
                } catch (IllegalArgumentException e) {
                    logger.error("Invalid ObjectId: {}", dto.getId(), e);
                    throw new IllegalArgumentException("Invalid ID format", e);
                }
            }

            question.setQuestionText(dto.getQuestionText());

            if (question instanceof TrueFalseQuestion tfQuestion && dto instanceof TrueFalseQuestionDTO trueFalseDTO) {
                tfQuestion.setCorrectAnswer(trueFalseDTO.getCorrectAnswer());
                logger.debug("Set correct answer for TrueFalseQuestion: {}", trueFalseDTO.getCorrectAnswer());
            }

            if (question instanceof MultipleChoiceQuestion mcQuestion && dto instanceof MultipleChoiceQuestionDTO multipleChoiceDTO) {
                mcQuestion.setChoices(multipleChoiceDTO.getChoices());
                mcQuestion.setCorrectAnswerIndexes(multipleChoiceDTO.getCorrectAnswerIndexes());
                logger.debug("Set choices and correct answer indexes for MultipleChoiceQuestion");
            }

            logger.debug("Converted DTO to Question entity: {}", question);
            return question;
        } catch (Exception e) {
            logger.error("Error converting DTO to Question entity", e);
            throw new RuntimeException("Failed to convert DTO to Question entity", e);
        }
    }
}