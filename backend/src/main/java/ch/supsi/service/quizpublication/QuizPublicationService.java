package ch.supsi.service.quizpublication;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.QuizPublicationMapper;
import ch.supsi.mapper.question.builder.QuestionMapperBuilder;
import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.repository.QuizPublicationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizPublicationService implements IQuizPublicationService {

    private static final String CODE_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;

    @Inject
    QuizPublicationRepository quizPublicationRepository;

    @Inject
    QuizPublicationMapper quizPublicationMapper;

    @Inject
    QuestionMapperBuilder questionMapperBuilder;

    @Override
    public QuizPublicationDTO publishQuiz(QuizPublicationDTO quizPublicationDTO) {
        QuizPublication newQuizPublication = new QuizPublication(
                new ObjectId(quizPublicationDTO.getCourseId()),
                new ObjectId(quizPublicationDTO.getFolderId()),
                new ObjectId(quizPublicationDTO.getQuizId()),
                quizPublicationDTO.getQuestions().stream()
                        .map(questionDTO -> {
                            IBaseMapper<Question, QuestionDTO> mapper =
                                    (IBaseMapper<Question, QuestionDTO>) questionMapperBuilder.getQuestionDTOMapper(questionDTO.getType());

                            return mapper.toEntity(questionDTO);
                        })
                        .collect(Collectors.toList()),
                generateUniqueCode()
        );

        newQuizPublication.published = true;
        newQuizPublication.createdAt = LocalDateTime.now();
        newQuizPublication.anonymous = quizPublicationDTO.getAnonymous();

        this.quizPublicationRepository.persist(newQuizPublication);
        return this.quizPublicationMapper.toDTO(newQuizPublication);
    }

    @Override
    public QuizPublicationDTO getQuizPublicationById(ObjectId publicationID) {
        Optional<QuizPublication> quizPublicationOpt = this.quizPublicationRepository.findByIdOptional(publicationID);
        if (quizPublicationOpt.isEmpty()) {
            throw new NotFoundException("Quiz publication with id " + publicationID + " not found");
        }

        return this.quizPublicationMapper.toDTO(quizPublicationOpt.get());
    }

    @Override
    public QuizPublicationDTO getPublicationByCode(String code) {
        Optional<QuizPublication> quizPublicationOpt = this.quizPublicationRepository.findByCodeOptional(code);
        if (quizPublicationOpt.isEmpty()) {
            throw new NotFoundException("Quiz publication with code " + code + " not found");
        }
        return this.quizPublicationMapper.toDTO(quizPublicationOpt.get());
    }

    @Override
    public QuizPublicationDTO updateQuizPublication(QuizPublicationDTO quizPublicationDTO) {
        Optional<QuizPublication> quizPublicationOpt = this.quizPublicationRepository.findByIdOptional(new ObjectId(quizPublicationDTO.getId()));
        if (quizPublicationOpt.isEmpty()) {
            throw new NotFoundException("Quiz publication with id " + quizPublicationDTO.getId() + " not found");
        }

        QuizPublication existingPublication = quizPublicationOpt.get();
        existingPublication.courseId = new ObjectId(quizPublicationDTO.getCourseId());
        existingPublication.folderId = new ObjectId(quizPublicationDTO.getFolderId());
        existingPublication.quizId = new ObjectId(quizPublicationDTO.getQuizId());
        existingPublication.published = quizPublicationDTO.getPublished();
        existingPublication.anonymous = quizPublicationDTO.getAnonymous();

        quizPublicationRepository.update(existingPublication);
        return quizPublicationMapper.toDTO(existingPublication);
    }

    @Override
    public QuizPublicationDTO deactivateQuizPublication(ObjectId publicationId) {
        Optional<QuizPublication> quizPublicationOpt = this.quizPublicationRepository.findByIdOptional(publicationId);
        if (quizPublicationOpt.isEmpty()) {
            throw new NotFoundException("Quiz publication with id " + publicationId + " not found");
        }

        QuizPublication quizPublication = quizPublicationOpt.get();
        quizPublication.published = false;
        quizPublication.closedAt = LocalDateTime.now();
        this.quizPublicationRepository.update(quizPublication);
        return this.quizPublicationMapper.toDTO(quizPublication);
    }

    @Override
    public boolean deleteQuizPublication(ObjectId publicationId) {
        Optional<QuizPublication> publicationOpt = this.quizPublicationRepository.findByIdOptional(publicationId);

        if (publicationOpt.isEmpty()) {
            throw new NotFoundException("QUiz publication not found");
        }

        quizPublicationRepository.delete(publicationOpt.get());
        return true;
    }

    @Override
    public List<QuizPublicationDTO> getPublicationsByQuizId(ObjectId quizId) {
        List<QuizPublication> publications = this.quizPublicationRepository.findPublicationsByQuizId(quizId);

        return publications.stream()
                .map(this.quizPublicationMapper::toDTO)
                .collect(Collectors.toList());
    }

    private String generateUniqueCode() {
        Random random = new Random();
        String code;
        do {
            StringBuilder sb = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                sb.append(CODE_CHARACTERS.charAt(random.nextInt(CODE_CHARACTERS.length())));
            }
            code = sb.toString();
        } while (this.quizPublicationRepository.findByCodeOptional(code).isPresent());

        return code;
    }
}