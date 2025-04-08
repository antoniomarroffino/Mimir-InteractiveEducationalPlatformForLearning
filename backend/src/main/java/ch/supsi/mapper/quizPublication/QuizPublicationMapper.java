package ch.supsi.mapper.quizPublication;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.constraints.NotNull;
import org.bson.types.ObjectId;

import java.util.List;

@ApplicationScoped
public class QuizPublicationMapper {

    public QuizPublicationDTO toDTO(@NotNull QuizPublication quizPublication, List<QuestionDTO> questionDTOList) {
        QuizPublicationDTO dto = new QuizPublicationDTO();
        dto.setId(quizPublication.id.toString());
        dto.setCourseId(quizPublication.courseId.toString());
        dto.setFolderId(quizPublication.folderId.toString());
        dto.setQuizId(quizPublication.quizId.toString());
        dto.setPublicationCode(quizPublication.publicationCode);
        dto.setPublished(quizPublication.published);
        dto.setAnonymous(quizPublication.anonymous);
        dto.setCreatedAt(quizPublication.createdAt);
        dto.setClosedAt(quizPublication.closedAt);
        dto.setQuestions(questionDTOList);
        return dto;
    }

    public QuizPublication toEntity(@NotNull QuizPublicationDTO dto, List<Question> questionList) {
        QuizPublication quizPublication = new QuizPublication();
        if (dto.getId() != null)
            quizPublication.id = new ObjectId(dto.getId());
        quizPublication.courseId = new ObjectId(dto.getCourseId());
        quizPublication.folderId = new ObjectId(dto.getFolderId());
        quizPublication.quizId = new ObjectId(dto.getQuizId());
        quizPublication.publicationCode = dto.getPublicationCode();
        quizPublication.published = dto.getPublished();
        quizPublication.anonymous = dto.getAnonymous();
        quizPublication.createdAt = dto.getCreatedAt();
        quizPublication.closedAt = dto.getClosedAt();
        quizPublication.questions = questionList;
        return quizPublication;
    }
}