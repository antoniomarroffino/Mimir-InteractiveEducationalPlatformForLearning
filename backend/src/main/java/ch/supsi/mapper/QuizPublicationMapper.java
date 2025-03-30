package ch.supsi.mapper;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;

@ApplicationScoped
public class QuizPublicationMapper implements IBaseMapper<QuizPublication, QuizPublicationDTO> {

    @Override
    public QuizPublicationDTO toDTO(QuizPublication quizPublication) {
        if (quizPublication == null) {
            return null;
        }

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

        return dto;
    }

    @Override
    public QuizPublication toEntity(QuizPublicationDTO dto) {
        if (dto == null) {
            return null;
        }

        QuizPublication quizPublication = new QuizPublication();
        quizPublication.id = new ObjectId(dto.getId());
        quizPublication.courseId = new ObjectId(dto.getCourseId());
        quizPublication.folderId = new ObjectId(dto.getFolderId());
        quizPublication.quizId = new ObjectId(dto.getQuizId());
        quizPublication.publicationCode = dto.getPublicationCode();
        quizPublication.published = dto.getPublished();
        quizPublication.anonymous = dto.getAnonymous();
        quizPublication.createdAt = dto.getCreatedAt();
        quizPublication.closedAt = dto.getClosedAt();

        return quizPublication;
    }
}