package ch.supsi.service.questionBank;

import ch.supsi.model.dto.api.QuestionBankDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface IQuestionBankService {
    QuestionBankDTO createQuestionBank(QuestionBankDTO questionBankDTO);

    List<QuestionBankDTO> getAllQuestionBanks();

    QuestionBankDTO getQuestionBankById(ObjectId id);

    QuestionBankDTO updateQuestionBank(ObjectId id, QuestionBankDTO questionBankDTO);

    void updateQuestionOrder(ObjectId bankId, List<String> orderedQuestionIds);

    void deleteQuestionBank(ObjectId id);
}
