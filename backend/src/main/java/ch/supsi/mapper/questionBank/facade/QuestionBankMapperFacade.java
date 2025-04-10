package ch.supsi.mapper.questionBank.facade;

import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.mapper.questionBank.QuestionBankMapper;
import ch.supsi.model.api.QuestionBank;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.QuestionBankDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.repository.QuestionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuestionBankMapperFacade implements IQuestionBankMapperFacade {
    @Inject
    QuestionBankMapper questionBankMapper;

    @Inject
    IQuestionMapperBuilder questionMapperBuilder;

    @Inject
    QuestionRepository questionRepository;

    @Override
    public QuestionBankDTO toDTO(QuestionBank entity) {
        if (entity == null) return null;

        List<Question> questions = this.getQuestionsByIds(entity.questions);

        List<QuestionDTO> questionsDTO = questions
                .stream()
                .map(q -> this.questionMapperBuilder.getQuestionDTOMapper(q.type).toDTO(q))
                .toList();

        return this.questionBankMapper.toDTO(entity, questionsDTO);
    }

    @Override
    public QuestionBank toEntity(QuestionBankDTO dto) {
        if (dto == null) return null;

        Set<String> questionIdList = dto.getQuestions()
                .stream()
                .map(QuestionDTO::getId)
                .collect(Collectors.toSet());

        return this.questionBankMapper.toEntity(dto, questionIdList);
    }

    private List<Question> getQuestionsByIds(@NotNull Set<String> idList) {
        return idList.stream()
                .map(ObjectId::new)
                .map(this.questionRepository::findByIdOptional)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
    }
}
