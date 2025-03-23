package ch.supsi.mapper.question;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.service.question.builder.QuestionFactory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

@ApplicationScoped
public class QuestionMapper implements IBaseMapper<Question, QuestionDTO> {

    @Inject
    QuestionFactory questionFactory;

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

            // Usa instanceof e getClass() per verificare il tipo più accuratamente
            switch (dto.getType()) {
                case TRUE_FALSE:
                    if (question instanceof TrueFalseQuestion && dto instanceof TrueFalseQuestionDTO) {
                        TrueFalseQuestion tfQuestion = (TrueFalseQuestion) question;
                        TrueFalseQuestionDTO trueFalseDTO = (TrueFalseQuestionDTO) dto;
                        tfQuestion.setCorrectAnswer(trueFalseDTO.getCorrectAnswer());
                    } else {
                        throw new IllegalArgumentException("Incompatible types for TrueFalse question");
                    }
                    break;

                case MULTIPLE_CHOICE:
                    if (question instanceof MultipleChoiceQuestion && dto instanceof MultipleChoiceQuestionDTO) {
                        MultipleChoiceQuestion mcQuestion = (MultipleChoiceQuestion) question;
                        MultipleChoiceQuestionDTO multipleChoiceDTO = (MultipleChoiceQuestionDTO) dto;

                        // Aggiungi log o debug per verificare i valori
                        System.out.println("Choices: " + multipleChoiceDTO.getChoices());
                        System.out.println("Correct Indexes: " + multipleChoiceDTO.getCorrectAnswerIndexes());

                        mcQuestion.setChoices(multipleChoiceDTO.getChoices());
                        mcQuestion.setCorrectAnswerIndexes(multipleChoiceDTO.getCorrectAnswerIndexes());
                    } else {
                        throw new IllegalArgumentException("Incompatible types for Multiple Choice question");
                    }
                    break;

                default:
                    // Gestisci altri tipi di domande se necessario
                    break;
            }

            return question;
        } catch (Exception e) {
            // Log dettagliato dell'errore
            System.err.println("Failed to convert DTO to Question entity");
            e.printStackTrace();
            throw new RuntimeException("Failed to convert DTO to Question entity", e);
        }
    }
}