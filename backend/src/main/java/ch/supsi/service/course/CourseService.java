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
import jakarta.ws.rs.ForbiddenException;
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
    public List<CourseDTO> getTeacherCourses(User user) {
        if (user == null)
            throw new InternalServerErrorException("User logged is null");

        return user.coursesId.stream()
                .map(ObjectId::new)
                .map(this::findCourseById)
                .map(this.courseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseDTO> getAllCourses() {
        return this.courseRepository.listAll().stream()
                .map(this.courseMapper::toDTO)
                .toList();
    }

    @Override
    public CourseDTO getCourseById(ObjectId id) {
        return this.courseMapper.toDTO(this.findCourseById(id));
    }

    @Override
    public CourseDTO createCourse(CourseDTO courseDTO, User currentUser) {
        if (currentUser == null)
            throw new InternalServerErrorException("User logged is null");

        this.verifyCourseIsValid(courseDTO);

        Course course = this.courseMapper.toEntity(courseDTO);
        this.courseRepository.persist(course);

        this.userRepository.addCourseToUser(course.id.toString(), currentUser.azureOid);

        return this.courseMapper.toDTO(course);
    }

    @Override
    public void assignCourse(ObjectId id, User currentUser) {
        if (currentUser == null)
            throw new InternalServerErrorException("User logged is null");

        Course course = this.findCourseById(id);

        this.userRepository.addCourseToUser(course.id.toString(), currentUser.azureOid);
    }

    @Override
    public void leftCourse(ObjectId id, User currentUser) {
        if (currentUser == null)
            throw new InternalServerErrorException("User logged is null");

        Course course = this.findCourseById(id);

        this.userRepository.removeCourseFromUser(course.id.toString(), currentUser.azureOid);
    }

    @Override
    public CourseDTO updateCourse(ObjectId id, CourseDTO courseDTO, User currentUser) {
        if (currentUser == null)
            throw new InternalServerErrorException("User logged is null");

        this.verifyCourseIsValid(courseDTO);

        Course course = this.findCourseById(id);

        this.verifyUserIsOwner(id, currentUser);

        String newName = courseDTO.getName();
        if (!course.name.equalsIgnoreCase(newName)) {
            course.name = courseDTO.getName();
        }

        course.description = courseDTO.getDescription();

        this.courseRepository.update(course);

        return this.courseMapper.toDTO(course);
    }

    @Override
    public void deleteCourse(ObjectId id, User currentUser) {
        if (currentUser == null)
            throw new InternalServerErrorException("User logged is null");

        Course course = this.findCourseById(id);

        this.verifyUserIsOwner(id, currentUser);

        this.userRepository.removeCourseFromUser(id.toString(), currentUser.azureOid);
        this.courseRepository.delete(course);
    }

    private void verifyUserIsOwner(ObjectId courseId, User user) {
        if (!user.coursesId.contains(courseId.toString()))
            throw new ForbiddenException("You are not authorized to update or delete this course");
    }

    private Course findCourseById(ObjectId courseId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if(courseOpt.isEmpty())
            throw new NotFoundException("Course " + courseId + " not found");
        return courseOpt.get();
    }

    private void verifyCourseIsValid(CourseDTO courseDTO) {
        if (courseDTO == null) {
            throw new BadRequestException("Course data cannot be null");
        }

        String courseName = courseDTO.getName().trim();
        if (courseName.isEmpty()) {
            throw new BadRequestException("Course name cannot be empty");
        }

        if (this.isCourseNameDuplicated(courseDTO.getName())) {
            throw new BadRequestException("Course name " + courseName + " already exists");
        }
    }

    private boolean isCourseNameDuplicated(String courseName) {
        return this.courseRepository.findByNameOptional(courseName).isPresent();
    }
}