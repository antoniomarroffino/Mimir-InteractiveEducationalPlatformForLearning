package ch.supsi.service.question;

import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.repository.CourseRepository;
import ch.supsi.service.question.builder.IQuestionFactory;
import ch.supsi.service.question.strategy.IQuestionCreationStrategy;
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
    IQuestionMapperBuilder questionMapperBuilder;


    public QuestionService() {
    }

    @Override
    public QuestionDTO createQuestionTemplate(QuestionType type) {
        return this.questionMapperBuilder.getQuestionDTOMapper(type).toDTO(this.questionFactory.getStrategy(type).createQuestion());
    }

    @Override
    public List<QuestionDTO> getQuestionsInQuiz(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Quiz quiz = this.getQuizFromCourse(courseId, folderId, quizId);

        return quiz.getQuestions().stream()
                .map(q -> this.questionMapperBuilder.getQuestionDTOMapper(q.type).toDTO(q))
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

        Folder folder = courseOpt.get().folders.stream()
                .filter(f -> f.id.equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found"));

        Quiz quiz = folder.quizzes.stream()
                .filter(q -> q.getId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        Question question = this.questionMapperBuilder.getQuestionDTOMapper(questionDTO.getType()).toEntity(questionDTO);
        quiz.getQuestions().add(question);
        quiz.setUpdatedAt(LocalDateTime.now());
        this.courseRepository.update(courseOpt.get());

        Question savedQuestion = quiz.getQuestions().stream()
                .filter(q -> q.id.equals(question.id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Question not saved"));

        return this.questionMapperBuilder.getQuestionDTOMapper(questionDTO.getType()).toDTO(savedQuestion);
    }

    @Override
    public QuestionDTO updateQuestion(ObjectId courseId, ObjectId folderId, ObjectId quizId, ObjectId questionId, QuestionDTO questionDTO) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);

        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = courseOpt.get().folders.stream()
                .filter(f -> f.id.equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found"));

        Quiz quiz = folder.quizzes.stream()
                .filter(q -> q.getId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        Question question = quiz.getQuestions().stream()
                .filter(q -> q.id.equals(questionId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Question not found"));

        this.questionFactory.getStrategy(question.type).updateQuestion(question, questionDTO);
        this.courseRepository.update(courseOpt.get());
        return this.questionMapperBuilder.getQuestionDTOMapper(questionDTO.getType()).toDTO(question);
    }

    @Override
    public void deleteQuestion(ObjectId courseId, ObjectId folderId, ObjectId quizId, ObjectId questionId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);

        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = courseOpt.get().folders.stream()
                .filter(f -> f.id.equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found"));

        Quiz quiz = folder.quizzes.stream()
                .filter(q -> q.getId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found"));


        boolean removed = quiz.getQuestions().removeIf(q -> q.id.equals(questionId));
        if (!removed) {
            throw new NotFoundException("Question not found in Quiz");
        }

        this.courseRepository.update(courseOpt.get());
    }

    private Quiz getQuizFromCourse(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = courseOpt.get().folders.stream()
                .filter(f -> f.id.equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        return folder.quizzes.stream()
                .filter(q -> q.getId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found in folder"));
    }
}