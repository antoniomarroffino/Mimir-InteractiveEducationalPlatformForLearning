package ch.supsi.service.quiz;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import java.util.List;

@ApplicationScoped
public class QuizService implements IQuizService {

    @Inject
    CourseRepository courseRepository;

    @Override
    public List<QuizDTO> getQuizzesInFolder(ObjectId courseId, ObjectId folderId) {
        Folder folder = getFolderFromCourse(courseId, folderId);
        return folder.getQuizzes().stream()
                .map(QuizDTO::fromEntity)
                .toList();
    }

    @Override
    public QuizDTO getQuizInFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Folder folder = getFolderFromCourse(courseId, folderId);
        return folder.getQuizzes().stream()
                .filter(q -> q.getId().equals(quizId))
                .map(QuizDTO::fromEntity)
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found in folder"));
    }

    @Override
    public QuizDTO addQuizToFolder(ObjectId courseId, ObjectId folderId, QuizDTO quizDTO) {
        Course course = courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = course.getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        Quiz quiz = quizDTO.toEntity();
        quiz.setId(new ObjectId());

        folder.getQuizzes().add(quiz);
        courseRepository.update(course);

        return QuizDTO.fromEntity(quiz);
    }

    @Override
    public QuizDTO updateQuizInFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId, QuizDTO quizDTO) {
        Course course = courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = course.getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        Quiz existingQuiz = folder.getQuizzes().stream()
                .filter(q -> q.getId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found in folder"));

        Quiz updatedQuiz = quizDTO.toEntity();
        updatedQuiz.setId(existingQuiz.getId());

        int index = folder.getQuizzes().indexOf(existingQuiz);
        folder.getQuizzes().set(index, updatedQuiz);

        courseRepository.update(course);

        return QuizDTO.fromEntity(updatedQuiz);
    }

    @Override
    public void removeQuizFromFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Course course = courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = course.getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        boolean removed = folder.getQuizzes().removeIf(q -> q.getId().equals(quizId));
        if (!removed) {
            throw new NotFoundException("Quiz not found in folder");
        }

        courseRepository.update(course);
    }

    private Folder getFolderFromCourse(ObjectId courseId, ObjectId folderId) {
        Course course = courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        return course.getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));
    }
}
