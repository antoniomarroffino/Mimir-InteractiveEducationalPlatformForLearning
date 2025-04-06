package ch.supsi.service.quiz;

import ch.supsi.mapper.CourseMapper;
import ch.supsi.mapper.FolderMapper;
import ch.supsi.mapper.quiz.facade.IQuizMapperFacade;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizService implements IQuizService {

    @Inject
    CourseRepository courseRepository;

    @Inject
    IQuizMapperFacade quizMapperFacade;

    @Inject
    FolderMapper folderMapper;

    @Inject
    CourseMapper courseMapper;

    @Override
    public List<QuizDTO> getQuizzesInFolder(FolderDTO folderDTO) {
        this.verifyFolderDTOIsValid(folderDTO);
        return this.folderMapper
                .toEntity(folderDTO)
                .quizzes.stream()
                .map(this.quizMapperFacade::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public QuizDTO getQuizInFolder(FolderDTO folderDTO, ObjectId quizId) {
        this.verifyFolderDTOIsValid(folderDTO);
        Quiz foundedQuiz = this.findQuizInFolder(
                this.folderMapper.toEntity(folderDTO),
                quizId
        );
        return this.quizMapperFacade.toDTO(foundedQuiz);
    }

    @Override
    public QuizDTO addQuizToFolder(CourseDTO courseDTO, FolderDTO folderDTO, QuizDTO quizDTO) {
        this.verifyCourseDTOIsValid(courseDTO);
        this.verifyFolderDTOIsValid(folderDTO);

        Course course = this.courseMapper.toEntity(courseDTO);
        Folder folder = this.folderMapper.toEntity(folderDTO);
        Quiz quiz = this.quizMapperFacade.toEntity(quizDTO);

        folder.quizzes.add(quiz);
        this.courseRepository.update(course);

        return this.quizMapperFacade.toDTO(quiz);
    }

    @Override
    public QuizDTO updateQuizInFolder(CourseDTO courseDTO, FolderDTO folderDTO, ObjectId quizId, QuizDTO quizDTO) {
        this.verifyCourseDTOIsValid(courseDTO);
        this.verifyFolderDTOIsValid(folderDTO);

        if (quizDTO == null) throw new BadRequestException("QuizDTO is null");

        Course course = this.courseMapper.toEntity(courseDTO);
        Folder folder = this.folderMapper.toEntity(folderDTO);

        Quiz existingQuiz = this.findQuizInFolder(folder, quizId);

        Quiz updatedQuiz = this.quizMapperFacade.toEntity(quizDTO);
        updatedQuiz.createdAt = quizDTO.getCreatedAt();
        updatedQuiz.updatedAt = LocalDateTime.now();
        updatedQuiz.questionsId = quizDTO.getQuestions().stream().map(QuestionDTO::getId).collect(Collectors.toSet());

        int index = folder.quizzes.indexOf(existingQuiz);
        folder.quizzes.set(index, updatedQuiz);
        this.courseRepository.update(course);

        return this.quizMapperFacade.toDTO(updatedQuiz);
    }

    @Override
    public void removeQuizFromFolder(CourseDTO courseDTO, FolderDTO folderDTO, ObjectId quizId) {
        this.verifyCourseDTOIsValid(courseDTO);
        this.verifyFolderDTOIsValid(folderDTO);

        Course course = this.courseMapper.toEntity(courseDTO);
        Folder folder = this.folderMapper.toEntity(folderDTO);

        Quiz existingQuiz = this.findQuizInFolder(folder, quizId);

        folder.quizzes.remove(existingQuiz);

        this.courseRepository.update(course);
    }

    private void verifyCourseDTOIsValid(CourseDTO courseDTO) {
        if(courseDTO == null)
            throw new BadRequestException("Course passed is null");
    }

    private void verifyFolderDTOIsValid(FolderDTO folderDTO) {
        if(folderDTO == null)
            throw new BadRequestException("Folder passed is null");
    }

    private Quiz findQuizInFolder(Folder folder, ObjectId quizId) {
        return folder.quizzes
                .stream()
                .filter(q -> q.id.equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz with id " + quizId + " not found in folder"));
    }
}