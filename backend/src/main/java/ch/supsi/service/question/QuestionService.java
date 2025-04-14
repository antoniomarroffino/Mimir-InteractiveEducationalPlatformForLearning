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
import jakarta.ws.rs.BadRequestException;
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

    @Override
    public QuestionDTO createQuestionTemplate(QuestionType type) {
        Question question = this.questionFactory.getStrategy(type).createQuestion();

        return this.questionMapperBuilder
                .getQuestionDTOMapper(type)
                .toDTO(question);
    }

    @Override
    public QuestionDTO createQuestionInQuestionBank(QuestionDTO questionDTO) {
        if (questionDTO == null) throw new BadRequestException("QuestionDTO is null");

        QuestionBank questionBank = this.findQuestionBankById(new ObjectId(questionDTO.getQuestionBankId()));

        Question question = this.questionMapperBuilder.getQuestionDTOMapper(questionDTO.getType()).toEntity(questionDTO);
        this.questionRepository.persist(question);
        this.questionBankRepository.addQuestionToQuestionBank(question.id.toString(), questionBank.id);

        return this.questionMapperBuilder.getQuestionDTOMapper(questionDTO.getType()).toDTO(question);
    }

    @Override
    public QuestionDTO updateQuestion(ObjectId questionId, QuestionDTO questionDTO) {
        if (questionDTO == null) throw new BadRequestException("QuestionDTO is null");

        Question question = this.findQuestionById(questionId);

        this.questionFactory.getStrategy(question.type).updateQuestion(question, questionDTO);
        this.questionRepository.update(question);
        return this.questionMapperBuilder.getQuestionDTOMapper(questionDTO.getType()).toDTO(question);
    }

    @Override
    public void deleteQuestion(ObjectId questionId) {
        Question question = this.findQuestionById(questionId);

        QuestionBank questionBank = this.findQuestionBankById(new ObjectId(question.questionBankId));

        this.questionBankRepository.removeQuestionFromQuestionBank(question.id.toString(), questionBank.id);
        this.questionRepository.delete(question);
    }

    private Question findQuestionById(ObjectId questionId) {
        return this.questionRepository
                .findByIdOptional(questionId)
                .orElseThrow(() -> new NotFoundException("Question with id " + questionId + " not found"));
    }

    private QuestionBank findQuestionBankById(ObjectId questionBankId) {
        return this.questionBankRepository
                .findByIdOptional(questionBankId)
                .orElseThrow(() -> new NotFoundException("Question bank with id " + questionBankId + " not found"));
    }
}