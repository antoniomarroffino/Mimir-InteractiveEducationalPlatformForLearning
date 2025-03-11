package ch.supsi.service.course;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.repository.CourseRepository;
import ch.supsi.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class CourseService implements ICourseService {

    @Inject
    CourseRepository courseRepository;

    @Inject
    UserRepository userRepository;

    @Override
    public List<CourseDTO> getAllCourses(User user) {
        if(user == null)
            throw new InternalServerErrorException();

        System.out.println(user.getCoursesId().toString());
        return user.getCoursesId().stream()
                .map(courseId -> this.courseRepository.findByIdOptional(courseId))
                .map(Optional::orElseThrow)
                .map(new CourseDTO()::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDTO getCourseById(ObjectId id) {
        Optional<Course> course = this.courseRepository.findByIdOptional(id);
        if (course.isEmpty()) {
            throw new NotFoundException("Course " + id + " not found");
        }
        return new CourseDTO().fromEntity(course.get());
    }

    @Override
    public CourseDTO createCourse(CourseDTO courseDTO, User currentUser) {
        if(currentUser == null)
            throw new InternalServerErrorException();

        this.verifyCourseIsValid(courseDTO);

        Course course = courseDTO.toEntity();
        this.courseRepository.persist(course);

        currentUser.addCourse(course.getId());
        this.userRepository.update(currentUser);

        return courseDTO.fromEntity(course);
    }

    @Override
    public void assignCourse(ObjectId id, User currentUser) {
        if(currentUser == null)
            throw new InternalServerErrorException();

        Optional<Course> course = this.courseRepository.findByIdOptional(id);
        if (course.isEmpty())
            throw new NotFoundException("Course " + id + " not found");

        currentUser.addCourse(course.get().getId());
        this.userRepository.update(currentUser);
    }

    private void verifyCourseIsValid(CourseDTO courseDTO) {
        if (courseDTO == null)
            throw new BadRequestException("Course is null");

        String courseName = courseDTO.getName();

        if (this.isCourseNameDuplicated(courseName))
            throw new BadRequestException("Course name " + courseName + " already existing");
    }

    private boolean isCourseNameDuplicated(String courseName) {
        for (Course course : this.courseRepository.listAll())
            if (course.getName().equals(courseName))
                return true;

        return false;
    }
}