package ch.supsi.service.course;

import ch.supsi.mapper.CourseMapper;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.repository.CourseRepository;
import ch.supsi.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
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

    @Inject
    CourseMapper courseMapper;

    @Override
    public List<CourseDTO> getAllCourses(User user) {
        if (user == null)
            throw new InternalServerErrorException();

        return user.coursesId.stream()
                .map(courseId -> this.courseRepository.findByIdOptional(new ObjectId(courseId)))
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
        return courseMapper.toDTO(course);
    }

    @Override
    public CourseDTO createCourse(CourseDTO courseDTO, User currentUser) {
        if (currentUser == null)
            throw new InternalServerErrorException();

        this.verifyCourseIsValid(courseDTO);

        Course course = courseDTO.toEntity();
        this.courseRepository.persist(course);

        this.userRepository.addCourseToUser(course.getId().toString(), currentUser.azureOid);

        return courseDTO.fromEntity(course);
    }

    @Override
    public void assignCourse(ObjectId id, User currentUser) {
        if (currentUser == null)
            throw new InternalServerErrorException();

        Optional<Course> course = this.courseRepository.findByIdOptional(id);
        if (course.isEmpty())
            throw new NotFoundException("Course " + id + " not found");

        this.userRepository.addCourseToUser(course.get().getId().toString(), currentUser.azureOid);
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