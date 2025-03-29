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


    public QuestionService() {
    }

    @Override
    public QuestionDTO createQuestionTemplate(QuestionType type) {
        return this.questionMapperBuilder.getQuestionDTOMapper(type).toDTO(this.questionFactory.getStrategy(type).createQuestion());
    }

    @Override
    public QuestionDTO createQuestionInQuestionBank(QuestionDTO questionDTO) {
        if(questionDTO == null) throw new BadRequestException("QuestionDTO is null");

        Optional<QuestionBank> questionBankOpt = this.questionBankRepository.findByIdOptional(new ObjectId(questionDTO.getQuestionBankId()));

        if (questionBankOpt.isEmpty()) {
            throw new NotFoundException("Question bank not found");
        }

        Question question = this.questionMapperBuilder.getQuestionDTOMapper(questionDTO.getType()).toEntity(questionDTO);
        this.questionRepository.persist(question);
        this.questionBankRepository.addQuestionToQuestionBank(question.id.toString(), new ObjectId(question.questionBankId));

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
    public void deleteQuestion(ObjectId questionId) {
        Optional<Question> questionOpt = this.questionRepository.findByIdOptional(questionId);

        if (questionOpt.isEmpty()) {
            throw new NotFoundException("Question not found");
        }

        Question question = questionOpt.get();
        Optional<QuestionBank> questionBankOpt = this.questionBankRepository.findByIdOptional(new ObjectId(question.questionBankId));

        if (questionBankOpt.isEmpty()) {
            throw new NotFoundException("Question bank not found");
        }

        this.questionBankRepository.removeQuestionFromQuestionBank(question.id.toString(), new ObjectId(question.questionBankId));
        this.questionRepository.delete(questionOpt.get());
    }
}