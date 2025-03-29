package ch.supsi.service.question;

import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.model.api.QuestionBank;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.repository.QuestionBankRepository;
import ch.supsi.repository.QuestionRepository;
import ch.supsi.service.question.builder.IQuestionFactory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.util.Optional;

@ApplicationScoped
public class QuestionService implements IQuestionService {

    @Inject
    QuestionRepository questionRepository;

    @Inject
    QuestionBankRepository questionBankRepository;

    @Inject
    IQuestionFactory questionFactory;

    @Inject
    IQuestionMapperBuilder questionMapperBuilder;


    public QuestionService() {
    }

    @Override
    public QuestionDTO createQuestionTemplate(QuestionType type) {
        return this.questionMapperBuilder.getQuestionDTOMapper(type).toDTO(this.questionFactory.getStrategy(type).createQuestion());
    }

    @Override
    public QuestionDTO createQuestionInQuestionBank(
            ObjectId questionBankId,
            QuestionDTO questionDTO) {

        Optional<QuestionBank> questionBankOpt = this.questionBankRepository.findByIdOptional(questionBankId);

        if (questionBankOpt.isEmpty()) {
            throw new NotFoundException("Question bank not found");
        }

        Question question = this.questionMapperBuilder.getQuestionDTOMapper(questionDTO.getType()).toEntity(questionDTO);

        this.questionBankRepository.addQuestionToQuestionBank(question.id.toString(), questionBankId.toString());
        this.questionRepository.persist(question);

        return this.questionMapperBuilder.getQuestionDTOMapper(questionDTO.getType()).toDTO(question);
    }

    @Override
    public QuestionDTO updateQuestion(ObjectId questionId, QuestionDTO questionDTO) {
        Optional<Question> questionOpt = this.questionRepository.findByIdOptional(questionId);

        if (questionOpt.isEmpty()) {
            throw new NotFoundException("Question not found");
        }

        Question question = questionOpt.get();
        this.questionFactory.getStrategy(question.type).updateQuestion(question, questionDTO);
        this.questionRepository.update(question);
        return this.questionMapperBuilder.getQuestionDTOMapper(questionDTO.getType()).toDTO(question);
    }

    @Override
    public void deleteQuestionInQuestionBank(ObjectId questionId, ObjectId questionBankId) {
        Optional<Question> questionOpt = this.questionRepository.findByIdOptional(questionId);
        Optional<QuestionBank> questionBankOpt = this.questionBankRepository.findByIdOptional(questionBankId);

        if (questionOpt.isEmpty()) {
            throw new NotFoundException("Question not found");
        }

        if (questionBankOpt.isEmpty()) {
            throw new NotFoundException("Question bank not found");
        }

        this.questionBankRepository.removeQuestionFromQuestionBank(questionBankId.toString(), questionBankId.toString());
        this.questionRepository.delete(questionOpt.get());
    }
}