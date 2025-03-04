package ch.supsi.service.course;

import ch.supsi.model.api.Course;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import java.util.List;

@ApplicationScoped
public class CourseService implements ICourseService {

    @Override
    public List<Course> getAllCourses() {
        return Course.listAll();
    }

    @Override
    public Course getCourseById(ObjectId id) {
        Course course = Course.findById(id);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }
        return course;
    }

    @Override
    public Course createCourse(Course course) {
        course.persist();
        return course;
    }

    @Override
    public Course updateCourse(Course course) {
        Course existingCourse = getCourseById(course.id);
        existingCourse.setName(course.getName());
        existingCourse.update();
        return existingCourse;
    }

    @Override
    public void deleteCourse(ObjectId id) {
        Course course = getCourseById(id);
        course.delete();
    }
}