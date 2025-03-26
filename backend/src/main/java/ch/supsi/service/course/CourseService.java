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
            throw new InternalServerErrorException();

        return user.coursesId.stream()
                .map(courseId -> this.courseRepository.findByIdOptional(new ObjectId(courseId)))
                .map(Optional::orElseThrow)
                .map(this.courseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseDTO> getAllCourses() {
        return this.courseRepository.findAll().stream()
                .map(this.courseMapper::toDTO)
                .toList();
    }

    @Override
    public CourseDTO getCourseById(ObjectId id) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(id);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course " + id + " not found");
        }
        return this.courseMapper.toDTO(courseOpt.get());
    }

    @Override
    public CourseDTO createCourse(CourseDTO courseDTO, User currentUser) {
        if (currentUser == null)
            throw new InternalServerErrorException();

        this.verifyCourseIsValid(courseDTO);

        Course course = this.courseMapper.toEntity(courseDTO);
        this.courseRepository.persist(course);

        this.userRepository.addCourseToUser(course.id.toString(), currentUser.azureOid);

        return this.courseMapper.toDTO(course);
    }

    @Override
    public void assignCourse(ObjectId id, User currentUser) {
        if (currentUser == null)
            throw new InternalServerErrorException();

        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(id);
        if (courseOpt.isEmpty())
            throw new NotFoundException("Course " + id + " not found");

        this.userRepository.addCourseToUser(courseOpt.get().id.toString(), currentUser.azureOid);
    }

    @Override
    public CourseDTO updateCourse(ObjectId id, CourseDTO courseDTO, User currentUser) {
        if (currentUser == null)
            throw new InternalServerErrorException();

        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(id);
        if (courseOpt.isEmpty())
            throw new NotFoundException("Course " + id + " not found");

        if (!currentUser.coursesId.contains(id.toString()))
            throw new ForbiddenException("You are not authorized to update this course");

        Course existingCourse = courseOpt.get();

        String newName = courseDTO.getName().trim();
        if (!existingCourse.name.equalsIgnoreCase(newName)) {
            if (this.isCourseNameDuplicated(newName)) {
                throw new BadRequestException("Course name '" + newName + "' already exists");
            }

            existingCourse.name = courseDTO.getName();
        }

        existingCourse.description = courseDTO.getDescription();

        this.courseRepository.update(existingCourse);

        return this.courseMapper.toDTO(existingCourse);
    }

    @Override
    public void deleteCourse(ObjectId id, User currentUser) {
        if (currentUser == null)
            throw new InternalServerErrorException();

        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(id);
        if (courseOpt.isEmpty())
            throw new NotFoundException("Course " + id + " not found");

        if (!currentUser.coursesId.contains(id.toString()))
            throw new ForbiddenException("You are not authorized to delete this course");


        this.userRepository.removeCourseFromUser(id.toString(), currentUser.azureOid);
        this.courseRepository.delete(courseOpt.get());
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
            throw new BadRequestException("Course name '" + courseName + "' already exists");
        }
    }

    private boolean isCourseNameDuplicated(String courseName) {
        return this.courseRepository.findByNameOptional(courseName).isPresent();
    }
}