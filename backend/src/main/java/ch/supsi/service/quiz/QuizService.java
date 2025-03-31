package ch.supsi.service.quiz;

import ch.supsi.mapper.quiz.facade.IQuizMapperFacade;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
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

    @Override
    public List<QuizDTO> getQuizzesInFolder(ObjectId courseId, ObjectId folderId) {
        Folder folder = getFolderFromCourse(courseId, folderId);
        return folder.quizzes.stream()
                .map(this.quizMapperFacade::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public QuizDTO getQuizInFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Folder folder = this.getFolderFromCourse(courseId, folderId);

        return folder.quizzes.stream()
                .filter(q -> q.id.equals(quizId))
                .map(this.quizMapperFacade::toDTO)
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found in folder"));
    }

    @Override
    public QuizDTO addQuizToFolder(ObjectId courseId, ObjectId folderId, QuizDTO quizDTO) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = courseOpt.get().folders.stream()
                .filter(f -> f.id.equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        Quiz quiz = this.quizMapperFacade.toEntity(quizDTO);

        folder.quizzes.add(quiz);
        this.courseRepository.update(courseOpt.get());

        return this.quizMapperFacade.toDTO(quiz);
    }

    @Override
    public QuizDTO updateQuizInFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId, QuizDTO quizDTO) {
        if (quizDTO == null) throw new BadRequestException("QuizDTO is null");

        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = courseOpt.get().folders.stream()
                .filter(f -> f.id.equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        Quiz existingQuiz = folder.quizzes.stream()
                .filter(q -> q.id.equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found in folder"));

        Quiz updatedQuiz = this.quizMapperFacade.toEntity(quizDTO);
        updatedQuiz.createdAt = quizDTO.getCreatedAt();
        updatedQuiz.updatedAt = LocalDateTime.now();
        updatedQuiz.questionsId = quizDTO.getQuestions().stream().map(QuestionDTO::getId).collect(Collectors.toSet());

        int index = folder.quizzes.indexOf(existingQuiz);
        folder.quizzes.set(index, updatedQuiz);
        this.courseRepository.update(courseOpt.get());

        return this.quizMapperFacade.toDTO(updatedQuiz);
    }

    @Override
    public void removeQuizFromFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = courseOpt.get().folders.stream()
                .filter(f -> f.id.equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        boolean removed = folder.quizzes.removeIf(q -> q.id.equals(quizId));
        if (!removed) {
            throw new NotFoundException("Quiz not found in folder");
        }

        this.courseRepository.update(courseOpt.get());
    }

    private Folder getFolderFromCourse(ObjectId courseId, ObjectId folderId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course not found");
        }

        return courseOpt.get().folders.stream()
                .filter(f -> f.id.equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));
    }
}