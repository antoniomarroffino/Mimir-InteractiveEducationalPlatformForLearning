package ch.supsi.mapper.questionBank;


import ch.supsi.model.api.QuestionBank;
import ch.supsi.model.dto.api.QuestionBankDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.Set;

public class QuestionBankMapper {

    public QuestionBankDTO toDTO(@NotNull QuestionBank questionBank, List<QuestionDTO> questionDTOList) {
        QuestionBankDTO dto = new QuestionBankDTO();
        dto.setId(questionBank.id.toString());
        dto.setName(questionBank.name);
        dto.setLastModified(questionBank.lastModified);
        dto.setQuestions(questionDTOList);
        return dto;
    }

    public QuestionBank toEntity(@NotNull QuestionBankDTO dto, Set<String> questionIdList) {
        QuestionBank questionBank = new QuestionBank();

        if (dto.getId() != null) {
            questionBank.id = new ObjectId(dto.getId());
        }
        questionBank.name = dto.getName();
        questionBank.lastModified = dto.getLastModified();
        questionBank.questions = questionIdList;
        return questionBank;
    }
}
