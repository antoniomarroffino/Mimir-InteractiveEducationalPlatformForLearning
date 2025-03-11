package ch.supsi.service.course;

import ch.supsi.mapper.CourseMapper;
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

    private final CourseMapper courseMapper = CourseMapper.getInstance();

    @Override
    public List<CourseDTO> getAllCourses() {
        return this.courseRepository.listAll().stream()
                .map(courseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDTO getCourseById(ObjectId id) {
        Course course = this.courseRepository.findById(id);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }
        return courseMapper.toDTO(course);
    }

    @Override
    public CourseDTO createCourse(CourseDTO courseDTO) {
        Course course = courseMapper.toEntity(courseDTO);
        this.courseRepository.persist(course);
        return courseMapper.toDTO(course);
    }
}