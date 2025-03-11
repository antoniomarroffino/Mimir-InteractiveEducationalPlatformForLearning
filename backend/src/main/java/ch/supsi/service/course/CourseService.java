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

    @Inject
    CourseMapper courseMapper;

    @Override
    public List<CourseDTO> getAllCourses() {
        try {
            System.out.println("Starting getAllCourses method");
            List<Course> courses = this.courseRepository.findAllCourses();
            System.out.println("Courses retrieved successfully");

            return courses.stream()
                    .map(courseMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Detailed error in getAllCourses:");
            e.printStackTrace();
            throw e;
        }
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