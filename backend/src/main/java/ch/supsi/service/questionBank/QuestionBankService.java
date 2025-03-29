package ch.supsi.service.questionBank;

import ch.supsi.mapper.questionBank.facade.IQuestionBankMapperFacade;
import ch.supsi.model.api.QuestionBank;
import ch.supsi.model.dto.api.QuestionBankDTO;
import ch.supsi.repository.QuestionBankRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class QuestionBankService implements IQuestionBankService {
    @Inject
    QuestionBankRepository questionBankRepository;

    @Inject
    IQuestionBankMapperFacade questionBankMapperFacade;

    @Override
    public QuestionBankDTO createQuestionBank(QuestionBankDTO questionBankDTO) {
        this.verifyQuestionBankIsValid(questionBankDTO);

        QuestionBank questionBank = this.questionBankMapperFacade.toEntity(questionBankDTO);
        this.questionBankRepository.persist(questionBank);
        return this.questionBankMapperFacade.toDTO(questionBank);
    }

    @Override
    public List<QuestionBankDTO> getAllQuestionBanks() {
        return this.questionBankRepository
                .findAll()
                .stream()
                .map(this.questionBankMapperFacade::toDTO)
                .toList();
    }

    @Override
    public QuestionBankDTO getQuestionBankById(ObjectId id) {
        Optional<QuestionBank> questionBankOpt = this.questionBankRepository.findByIdOptional(id);

        if (questionBankOpt.isEmpty())
            throw new NotFoundException("QuestionBank not found");

        return this.questionBankMapperFacade.toDTO(questionBankOpt.get());
    }

    @Override
    public QuestionBankDTO updateQuestionBank(ObjectId id, QuestionBankDTO questionBankDTO) {
        this.verifyQuestionBankIsValid(questionBankDTO);

        Optional<QuestionBank> questionBankOpt = this.questionBankRepository.findByIdOptional(id);
        if (questionBankOpt.isEmpty())
            throw new NotFoundException("QuestionBank not found");

        QuestionBank questionBank = questionBankOpt.get();
        if (!questionBank.name.equalsIgnoreCase(questionBankDTO.getName()))
            questionBank.name = questionBankDTO.getName();

        questionBank.lastModified = LocalDateTime.now();
        this.questionBankRepository.update(questionBank);
        return this.questionBankMapperFacade.toDTO(questionBank);
    }

    @Override
    public void deleteQuestionBank(ObjectId id) {
        Optional<QuestionBank> questionBankOpt = this.questionBankRepository.findByIdOptional(id);
        if (questionBankOpt.isEmpty())
            throw new NotFoundException("QuestionBank not found");

        this.questionBankRepository.delete(questionBankOpt.get());
    }

    private void verifyQuestionBankIsValid(QuestionBankDTO questionBankDTO) {
        if (questionBankDTO == null)
            throw new BadRequestException("QuestionBank is null");

        String questionBankName = questionBankDTO.getName().trim();
        if (questionBankName.isEmpty())
            throw new BadRequestException("QuestionBank name is empty");

        if (this.isQuestionBankNameDuplicated(questionBankDTO.getName()))
            throw new BadRequestException("QuestionBank name already exists");
    }

    private boolean isQuestionBankNameDuplicated(String questionBankName) {
        return this.questionBankRepository.findByNameOptional(questionBankName).isPresent();
    }
}
