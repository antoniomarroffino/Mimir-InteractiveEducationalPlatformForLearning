package ch.supsi.mapper.quizPublication.facade;

import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.mapper.quizPublication.QuizPublicationMapper;
import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class QuizPublicationMapperFacade implements IQuizPublicationMapperFacade {
    @Inject
    QuizPublicationMapper quizPublicationMapper;

    @Inject
    IQuestionMapperBuilder questionMapperBuilder;

    @Override
    public QuizPublicationDTO toDTO(QuizPublication entity) {
        if (entity == null) return null;

        List<QuestionDTO> questionDTOList = this.getQuestionsDTOListFromQuestionsList(entity.questions);

        return this.quizPublicationMapper.toDTO(entity, questionDTOList);
    }

    @Override
    public QuizPublication toEntity(QuizPublicationDTO dto) {
        if (dto == null) return null;

        List<Question> questionList = this.getQuestionsFromDTOList(dto.getQuestions());

        return this.quizPublicationMapper.toEntity(dto, questionList);
    }

    private List<QuestionDTO> getQuestionsDTOListFromQuestionsList(List<Question> questions) {
        return questions
                .stream()
                .map(qEntity -> this.questionMapperBuilder.getQuestionDTOMapper(qEntity.type).toDTO(qEntity))
                .toList();
    }

    private List<Question> getQuestionsFromDTOList(List<QuestionDTO> dtoList) {
        return dtoList
                .stream()
                .map(qDTO -> this.questionMapperBuilder.getQuestionDTOMapper(qDTO.getType()).toEntity(qDTO))
                .toList();
    }
}
