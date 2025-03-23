package ch.supsi.mapper.question;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.service.question.builder.IQuestionFactory;
import com.oracle.svm.core.annotate.Delete;
import jakarta.decorator.Delegate;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

@ApplicationScoped
public class QuestionMapper extends AbstractQuestionMapper<Question, QuestionDTO> {
    @Inject
    IQuestionFactory questionFactory;

    @Override
    public QuestionDTO toDTO(Question question) {
        if (question == null) {
            return null;
        }

        QuestionDTO dto = new QuestionDTO();
        super.mapCommonFieldsQuestionToQuestionDTO(question, dto);
        return dto;
    }

    @Override
    public Question toEntity(QuestionDTO dto) {
        if (dto == null) {
            return null;
        }
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
    }
}