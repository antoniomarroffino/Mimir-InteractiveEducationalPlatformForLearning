package ch.supsi.mapper;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;

@ApplicationScoped
public class QuizPublicationMapper implements IBaseMapper<QuizPublication, QuizPublicationDTO> {

    private static @NotNull QuizPublicationDTO getQuizPublicationDTO(QuizPublication quizPublication) {
        QuizPublicationDTO dto = new QuizPublicationDTO();
        dto.setId(quizPublication.getId().toString());
        dto.setCourseId(quizPublication.getCourseId().toString());
        dto.setFolderId(quizPublication.getFolderId().toString());
        dto.setQuizId(quizPublication.getQuizId().toString());
        dto.setPublicationCode(quizPublication.getPublicationCode());
        dto.setAnonymous(quizPublication.isAnonymous());
        dto.setPublished(quizPublication.isPublished());
        return dto;
    }

    private static @NotNull QuizPublication getQuizPublication(QuizPublicationDTO dto) {
        QuizPublication quizPublication = new QuizPublication();
        quizPublication.setId(new ObjectId(dto.getId()));
        quizPublication.setCourseId(new ObjectId(dto.getCourseId()));
        quizPublication.setFolderId(new ObjectId(dto.getFolderId()));
        quizPublication.setQuizId(new ObjectId(dto.getQuizId()));
        quizPublication.setPublicationCode(dto.getPublicationCode());
        quizPublication.setAnonymous(dto.isAnonymous());
        quizPublication.setPublished(dto.isPublished());
        return quizPublication;
    }

    @Override
    public QuizPublicationDTO toDTO(QuizPublication quizPublication) {
        if (quizPublication == null) {
            return null;
        }
        return getQuizPublicationDTO(quizPublication);
    }

    @Override
    public QuizPublication toEntity(QuizPublicationDTO dto) {
        if (dto == null) {
            return null;
        }
        return getQuizPublication(dto);
    }
}