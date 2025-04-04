package ch.supsi.mapper.quiz.facade;

import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.mapper.quiz.QuizMapper;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.repository.QuestionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizMapperFacade implements IQuizMapperFacade {
    @Inject
    QuizMapper quizMapper;

    @Inject
    IQuestionMapperBuilder questionMapperBuilder;

    @Inject
    QuestionRepository questionRepository;

    @Override
    public QuizDTO toDTO(Quiz entity) {
        if (entity == null) return null;

        List<Question> questions = this.getQuestionsByIds(entity.questionsId);

        List<QuestionDTO> questionsDTO = questions
                .stream()
                .map(q -> this.questionMapperBuilder.getQuestionDTOMapper(q.type).toDTO(q))
                .toList();

        return this.quizMapper.toDTO(entity, questionsDTO);
    }

    @Override
    public Quiz toEntity(QuizDTO dto) {
        if (dto == null) return null;

        Set<String> questionIdList = dto.getQuestions()
                .stream()
                .map(QuestionDTO::getId)
                .collect(Collectors.toSet());

        return this.quizMapper.toEntity(dto, questionIdList);
    }

    private List<Question> getQuestionsByIds(Set<String> idList) {
        return idList.stream()
                .map(ObjectId::new)
                .map(this.questionRepository::findByIdOptional)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
    }
}
