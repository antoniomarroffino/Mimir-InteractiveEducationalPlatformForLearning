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
                .listAll()
                .stream()
                .map(this.questionBankMapperFacade::toDTO)
                .toList();
    }

    @Override
    public QuestionBankDTO getQuestionBankById(ObjectId id) {
        return this.questionBankMapperFacade
                .toDTO(
                        this.findQuestionBankById(id)
                );
    }

    @Override
    public QuestionBankDTO updateQuestionBank(ObjectId id, QuestionBankDTO questionBankDTO) {
        this.verifyQuestionBankIsValid(questionBankDTO);

        QuestionBank questionBank = this.findQuestionBankById(id);

        questionBank.name = questionBankDTO.getName();

        questionBank.lastModified = LocalDateTime.now();
        this.questionBankRepository.update(questionBank);
        return this.questionBankMapperFacade.toDTO(questionBank);
    }

    @Override
    public void deleteQuestionBank(ObjectId id) {
        QuestionBank questionBank = this.findQuestionBankById(id);
        this.questionBankRepository.delete(questionBank);
    }

    private QuestionBank findQuestionBankById(ObjectId id) {
        return this.questionBankRepository.findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Question bank with id " + id + " not found"));
    }

    private void verifyQuestionBankIsValid(QuestionBankDTO questionBankDTO) {
        if (questionBankDTO == null)
            throw new BadRequestException("QuestionBankDTO is null");

        String questionBankName = questionBankDTO.getName().trim();
        if (questionBankName.isEmpty())
            throw new BadRequestException("QuestionBankDTO name is empty");

        if (this.isQuestionBankNameDuplicated(questionBankDTO.getName()))
            throw new BadRequestException("QuestionBankDTO name already exists");
    }

    private boolean isQuestionBankNameDuplicated(String questionBankName) {
        return this.questionBankRepository.findByNameOptional(questionBankName).isPresent();
    }
}
