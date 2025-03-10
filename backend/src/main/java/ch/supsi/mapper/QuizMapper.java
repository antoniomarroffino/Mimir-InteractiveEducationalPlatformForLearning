package ch.supsi.mapper;

import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import org.bson.types.ObjectId;

import java.util.stream.Collectors;

public class QuizMapper implements BaseMapper<Quiz, QuizDTO> {
    private static QuizMapper instance;
    private final QuestionMapper questionMapper;

    private QuizMapper() {
        this.questionMapper = QuestionMapper.getInstance();
    }

    public static QuizMapper getInstance() {
        return instance == null ? instance = new QuizMapper() : instance;
    }

    @Override
    public QuizDTO toDTO(Quiz quiz) {
        if (quiz == null) {
            return null;
        }

        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId() != null ? quiz.getId().toString() : null);
        dto.setName(quiz.getName());
        dto.setDescription(quiz.getDescription());

        dto.setQuestions(quiz.getQuestions().stream()
                .map(questionMapper::toDTO)
                .collect(Collectors.toList()));

        dto.setCreatedAt(quiz.getCreatedAt());
        dto.setUpdatedAt(quiz.getUpdatedAt());

        return dto;
    }

    @Override
    public Quiz toEntity(QuizDTO dto) {
        if (dto == null) {
            return null;
        }

        Quiz quiz = new Quiz(dto.getName());

        if (dto.getId() != null) {
            quiz.setId(new ObjectId(dto.getId()));
        }

        quiz.setDescription(dto.getDescription());

        quiz.setQuestions(dto.getQuestions().stream()
                .map(questionMapper::toEntity)
                .collect(Collectors.toList()));

        quiz.setCreatedAt(dto.getCreatedAt());
        quiz.setUpdatedAt(dto.getUpdatedAt());

        return quiz;
    }
}