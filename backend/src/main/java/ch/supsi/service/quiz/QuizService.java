package ch.supsi.service.quiz;

import ch.supsi.mapper.CourseMapper;
import ch.supsi.mapper.quiz.facade.IQuizMapperFacade;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizService implements IQuizService {

    @Inject
    CourseRepository courseRepository;

    @Inject
    IQuizMapperFacade quizMapperFacade;

    @Inject
    CourseMapper courseMapper;


    @Override
    public List<QuizDTO> getQuizzesInFolder(CourseDTO courseDTO, ObjectId folderId) {
        Course course = this.courseMapper.toEntity(courseDTO);
        Folder folder = this.findFolderInCourse(course, folderId);
        return folder.quizzes.stream()
                .map(this.quizMapperFacade::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public QuizDTO getQuizInFolder(CourseDTO courseDTO, ObjectId folderId, ObjectId quizId) {
        Course course = this.courseMapper.toEntity(courseDTO);
        Folder folder = this.findFolderInCourse(course, folderId);
        Quiz quiz = this.findQuizInFolder(folder, quizId);
        return this.quizMapperFacade.toDTO(quiz);
    }

    @Override
    public QuizDTO addQuizToFolder(CourseDTO courseDTO, ObjectId folderId, QuizDTO quizDTO) {
        Course course = this.courseMapper.toEntity(courseDTO);
        Folder folder = this.findFolderInCourse(course, folderId);

        Quiz quiz = this.quizMapperFacade.toEntity(quizDTO);

        folder.quizzes.add(quiz);
        this.courseRepository.update(course);

        return this.quizMapperFacade.toDTO(quiz);
    }

    @Override
    public QuizDTO updateQuizInFolder(CourseDTO courseDTOd, ObjectId folderId, ObjectId quizId, QuizDTO quizDTO) {
        if (quizDTO == null) throw new BadRequestException("QuizDTO is null");

        Course course = this.courseMapper.toEntity(courseDTOd);
        Folder folder = this.findFolderInCourse(course, folderId);
        Quiz existingQuiz = this.findQuizInFolder(folder, quizId);

        Quiz updatedQuiz = this.quizMapperFacade.toEntity(quizDTO);
        updatedQuiz.createdAt = quizDTO.getCreatedAt();
        updatedQuiz.updatedAt = LocalDateTime.now();
        updatedQuiz.questionsId = quizDTO.getQuestions().stream()
                .map(questionDTO -> new ObjectId(questionDTO.getId()))
                .collect(Collectors.toSet());
        updatedQuiz.timeLimitMinutes = quizDTO.getTimeLimitMinutes();

        int index = folder.quizzes.indexOf(existingQuiz);
        folder.quizzes.set(index, updatedQuiz);
        this.courseRepository.update(course);

        return this.quizMapperFacade.toDTO(updatedQuiz);
    }

    @Override
    public void removeQuizFromFolder(CourseDTO courseDTO, ObjectId folderId, ObjectId quizId) {
        Course course = this.courseMapper.toEntity(courseDTO);
        Folder folder = this.findFolderInCourse(course, folderId);
        Quiz quiz = this.findQuizInFolder(folder, quizId);
        folder.quizzes.remove(quiz);
        this.courseRepository.update(course);

    }

    private Folder findFolderInCourse(Course course, ObjectId folderId) {
        return course.folders.stream()
                .filter(f -> f.id.equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder with id " + folderId + " not found in course"));
    }

    private Quiz findQuizInFolder(Folder folder, ObjectId quizId) {
        return folder.quizzes
                .stream()
                .filter(q -> q.id.equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz with id " + quizId + " not found in folder"));
    }
}