package ch.supsi.service.quizpublication;

import ch.supsi.mapper.quizPublication.facade.IQuizPublicationMapperFacade;
import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.dto.api.QuizPublicationDTO;
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
    IQuizPublicationMapperFacade quizPublicationMapperFacade;


    @Override
    public QuizPublicationDTO publishQuiz(QuizPublicationDTO quizPublicationDTO) {
        QuizPublication newQuizPublication = this.quizPublicationMapperFacade.toEntity(quizPublicationDTO);
        newQuizPublication.createdAt = LocalDateTime.now();
        newQuizPublication.published = true;
        newQuizPublication.publicationCode = this.generateUniqueCode();

        this.quizPublicationRepository.persist(newQuizPublication);
        return this.quizPublicationMapperFacade.toDTO(newQuizPublication);
    }

    @Override
    public QuizPublicationDTO getQuizPublicationById(ObjectId publicationID) {
        QuizPublication quizPublication = this.findQuizPublicationById(publicationID);
        return this.quizPublicationMapperFacade.toDTO(quizPublication);
    }

    @Override
    public QuizPublicationDTO getPublicationByCode(String code) {
        Optional<QuizPublication> quizPublicationOpt = this.quizPublicationRepository.findByCodeOptional(code);
        if (quizPublicationOpt.isEmpty())
            throw new NotFoundException("Quiz publication with code " + code + " not found");

        return this.quizPublicationMapperFacade.toDTO(quizPublicationOpt.get());
    }

    @Override
    public QuizPublicationDTO updateQuizPublication(ObjectId publicationId, QuizPublicationDTO quizPublicationDTO) {
        QuizPublication existingPublication = this.findQuizPublicationById(publicationId);
/*
        existingPublication.courseId = new ObjectId(quizPublicationDTO.getCourseId());
        existingPublication.folderId = new ObjectId(quizPublicationDTO.getFolderId());
        existingPublication.quizId = new ObjectId(quizPublicationDTO.getQuizId());
        existingPublication.published = quizPublicationDTO.getPublished();
        existingPublication.anonymous = quizPublicationDTO.getAnonymous();
*/
        quizPublicationRepository.update(existingPublication);
        return quizPublicationMapperFacade.toDTO(existingPublication);
    }

    @Override
    public QuizPublicationDTO deactivateQuizPublication(ObjectId publicationId) {
        QuizPublication quizPublication = this.findQuizPublicationById(publicationId);
        quizPublication.published = false;
        quizPublication.closedAt = LocalDateTime.now();
        this.quizPublicationRepository.update(quizPublication);
        return this.quizPublicationMapperFacade.toDTO(quizPublication);
    }

    @Override
    public void deleteQuizPublication(ObjectId publicationId) {
        QuizPublication quizPublication = this.findQuizPublicationById(publicationId);
        quizPublicationRepository.delete(quizPublication);
    }

    @Override
    public List<QuizPublicationDTO> getPublicationsByQuizId(ObjectId quizId) {
        List<QuizPublication> publications = this.quizPublicationRepository.findPublicationsByQuizId(quizId);

        return publications.stream()
                .map(this.quizPublicationMapperFacade::toDTO)
                .collect(Collectors.toList());
    }

    private QuizPublication findQuizPublicationById(ObjectId id) {
        return this.quizPublicationRepository
                .findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Quiz publication with id " + id + " not found"));
    }

    String generateUniqueCode() {
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