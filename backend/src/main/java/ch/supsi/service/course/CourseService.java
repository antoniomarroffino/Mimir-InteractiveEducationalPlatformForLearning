package ch.supsi.service.course;

import ch.supsi.model.api.Course;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import java.util.List;

@ApplicationScoped
public class CourseService implements ICourseService {

    @Inject
    CourseRepository courseRepository;

    @Override
    public List<Course> getAllCourses() {
        return this.courseRepository.listAll();
    }

    @Override
    public Course getCourseById(ObjectId id) {
        Course course = this.courseRepository.findById(id);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }
        return course;
    }

    @Override
    public Course createCourse(Course course) {
        this.courseRepository.persist(course);
        return course;
    }

    @Override
    public Course updateCourse(Course course) {
        Course existingCourse = getCourseById(course.getId());
        existingCourse.setName(course.getName());
        this.courseRepository.update(existingCourse);
        return existingCourse;
    }

    @Override
    public void deleteCourse(ObjectId id) {
        Course course = getCourseById(id);
        this.courseRepository.delete(course);
    }
}