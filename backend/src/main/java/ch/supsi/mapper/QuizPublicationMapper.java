package ch.supsi.mapper;

import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.mapper.response.builder.IQuestionResponseMapperBuilder;
import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizPublicationMapper implements IBaseMapper<QuizPublication, QuizPublicationDTO> {
    @Inject
    IQuestionMapperBuilder questionMapperBuilder;


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

        if (quizPublication.questions != null) {
            // Aggiungi log dettagliato
            System.out.println("Numero di domande: " + quizPublication.questions.size());
            System.out.println("Tipi di domande:");
            quizPublication.questions.forEach(q ->
                    System.out.println(q.getClass().getName() + " - Tipo: " + q.type)
            );

            List<QuestionDTO> questionDTOs = quizPublication.questions.stream()
                    .map(question -> {
                        try {
                            return this.questionMapperBuilder
                                    .getQuestionDTOMapper(question.type)
                                    .toDTO(question);
                        } catch (Exception e) {
                            System.err.println("Errore durante la conversione della domanda: " + e.getMessage());
                            e.printStackTrace();
                            throw e;
                        }
                    })
                    .collect(Collectors.toList());

            dto.setQuestions(questionDTOs);
        }

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

        if (dto.getQuestions() != null) {
            quizPublication.questions = dto.getQuestions().stream()
                    .map(questionDTO ->
                            this.questionMapperBuilder
                                    .getQuestionDTOMapper(questionDTO.getType())
                                    .toEntity(questionDTO)
                    )
                    .collect(Collectors.toList());
        }

        return quizPublication;
    }
}