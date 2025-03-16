package ch.supsi.service.question;

import ch.supsi.mapper.question.QuestionMapper;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.repository.CourseRepository;
import ch.supsi.service.question.builder.IQuestionFactory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class QuestionService implements IQuestionService {

    @Inject
    CourseRepository courseRepository;

    @Inject
    IQuestionFactory questionFactory;

    @Inject
    QuestionMapper questionMapper;


    public QuestionService() {
    }

    @Override
    public QuestionDTO createQuestionTemplate(QuestionType type) {
        return this.questionFactory.createQuestionTemplate(type);
    }

    @Override
    public List<QuestionDTO> getQuestionsInQuiz(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Quiz quiz = this.getQuizFromCourse(courseId, folderId, quizId);

        return quiz.getQuestions().stream()
                .map(this.questionMapper::toDTO)
                .toList();
    }

    @Override
    public QuestionDTO addQuestionToQuiz(
            ObjectId courseId,
            ObjectId folderId,
            ObjectId quizId,
            QuestionDTO questionDTO) {

        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);

        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = courseOpt.get().getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found"));

        Quiz quiz = folder.getQuizzes().stream()
                .filter(q -> q.getId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        Question question = this.questionMapper.toEntity(questionDTO);
        quiz.getQuestions().add(question);
        quiz.setUpdatedAt(LocalDateTime.now());
        this.courseRepository.update(courseOpt.get());

        Question savedQuestion = quiz.getQuestions().stream()
                .filter(q -> q.getId().equals(question.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Question not saved"));

        return this.questionMapper.toDTO(savedQuestion);
    }

    private Quiz getQuizFromCourse(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = courseOpt.get().getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        return folder.getQuizzes().stream()
                .filter(q -> q.getId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found in folder"));
    }
}