package ch.supsi.service.course;

import ch.supsi.model.api.Course;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class CourseService implements ICourseService {

    @Inject
    CourseRepository courseRepository;

    @Override
    public List<CourseDTO> getAllCourses() {
        return this.courseRepository.listAll().stream()
                .map(new CourseDTO()::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDTO getCourseById(ObjectId id) {
        Course course = this.courseRepository.findById(id);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }
        return new CourseDTO().fromEntity(course);
    }

    @Override
    public CourseDTO createCourse(CourseDTO courseDTO) {
        this.courseRepository.persist(courseDTO.toEntity());
        return courseDTO;
    }

}