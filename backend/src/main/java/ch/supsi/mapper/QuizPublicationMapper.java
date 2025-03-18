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
            System.err.println("Received null QuizPublication");
            return null;
        }

        try {
            QuizPublicationDTO dto = new QuizPublicationDTO();
            dto.setId(quizPublication.getId().toString());
            dto.setCourseId(quizPublication.getCourseId().toString());
            dto.setFolderId(quizPublication.getFolderId().toString());
            dto.setQuizId(quizPublication.getQuizId().toString());
            dto.setPublicationCode(quizPublication.getPublicationCode());
            return dto;

        } catch (Exception e) {
            System.err.println("Error converting QuizPublication to DTO for ID: " + quizPublication.getId());
            e.printStackTrace();
            throw new RuntimeException("Failed to convert QuizPublication to DTO", e);
        }
    }

    @Override
    public QuizPublication toEntity(QuizPublicationDTO dto) {
        if (dto == null) {
            System.err.println("Received null QuizPublicationDTO");
            return null;
        }

        try {
            QuizPublication quizPublication = new QuizPublication();
            quizPublication.setId(new ObjectId(dto.getId()));
            quizPublication.setCourseId(new ObjectId(dto.getCourseId()));
            quizPublication.setFolderId(new ObjectId(dto.getFolderId()));
            quizPublication.setQuizId(new ObjectId(dto.getQuizId()));
            return quizPublication;

        } catch (Exception e) {
            System.err.println("Error converting DTO to QuizPublication for course: " + dto.getCourseId());
            e.printStackTrace();
            throw new RuntimeException("Failed to convert DTO to QuizPublication", e);
        }
    }
}