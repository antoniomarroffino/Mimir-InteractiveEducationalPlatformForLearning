package ch.supsi.service.quiz;

import ch.supsi.mapper.QuizMapper;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
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
    QuizMapper quizMapper;

    @Override
    public List<QuizDTO> getQuizzesInFolder(ObjectId courseId, ObjectId folderId) {
        Folder folder = getFolderFromCourse(courseId, folderId);
        return folder.getQuizzes().stream()
                .map(this.quizMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public QuizDTO getQuizInFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Folder folder = this.getFolderFromCourse(courseId, folderId);

        return folder.getQuizzes().stream()
                .filter(q -> q.getId().equals(quizId))
                .map(this.quizMapper::toDTO)
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
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        Quiz quiz = this.quizMapper.toEntity(quizDTO);

        folder.getQuizzes().add(quiz);
        this.courseRepository.update(courseOpt.get());

        return this.quizMapper.toDTO(quiz);
    }

    @Override
    public QuizDTO updateQuizInFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId, QuizDTO quizDTO) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = courseOpt.get().folders.stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        Quiz existingQuiz = folder.getQuizzes().stream()
                .filter(q -> q.getId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found in folder"));

        Quiz updatedQuiz = this.quizMapper.toEntity(quizDTO);
        updatedQuiz.setId(existingQuiz.getId());
        updatedQuiz.setCreatedAt(existingQuiz.getCreatedAt());
        updatedQuiz.setUpdatedAt(LocalDateTime.now());

        int index = folder.getQuizzes().indexOf(existingQuiz);
        folder.getQuizzes().set(index, updatedQuiz);

        this.courseRepository.update(courseOpt.get());

        return this.quizMapper.toDTO(updatedQuiz);
    }

    @Override
    public void removeQuizFromFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = courseOpt.get().folders.stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        boolean removed = folder.getQuizzes().removeIf(q -> q.getId().equals(quizId));
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
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));
    }
}