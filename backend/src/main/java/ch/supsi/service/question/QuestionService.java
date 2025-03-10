package ch.supsi.service.question;

import ch.supsi.mapper.QuestionMapper;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.util.List;

@ApplicationScoped
public class QuestionService implements IQuestionService {

    @Inject
    CourseRepository courseRepository;

    private final QuestionFactory questionFactory;
    private final QuestionMapper questionMapper;

    public QuestionService() {
        this.questionFactory = QuestionFactory.getInstance();
        this.questionMapper = QuestionMapper.getInstance();
    }

    @Override
    public QuestionDTO createQuestionTemplate(QuestionType type) {
        Question question = questionFactory.createQuestion(type);
        return questionMapper.toDTO(question);
    }

    @Override
    public List<QuestionDTO> getQuestionsInQuiz(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Quiz quiz = getQuizFromCourse(courseId, folderId, quizId);
        return quiz.getQuestions().stream()
                .map(questionMapper::toDTO)
                .toList();
    }

    @Override
    public QuestionDTO addQuestionToQuiz(ObjectId courseId, ObjectId folderId, ObjectId quizId, QuestionDTO questionDTO) {
        Course course = courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = course.getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        Quiz quiz = folder.getQuizzes().stream()
                .filter(q -> q.getId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found in folder"));

        Question question = questionMapper.toEntity(questionDTO);
        quiz.getQuestions().add(question);

        courseRepository.update(course);

        return questionMapper.toDTO(question);
    }

    private Quiz getQuizFromCourse(ObjectId courseId, ObjectId folderId, ObjectId quizId) {
        Course course = courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = course.getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));

        return folder.getQuizzes().stream()
                .filter(q -> q.getId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Quiz not found in folder"));
    }
}