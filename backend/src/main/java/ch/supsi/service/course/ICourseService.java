package ch.supsi.service.course;

import ch.supsi.model.api.Course;
import org.bson.types.ObjectId;
import java.util.List;

public interface ICourseService {
    List<Course> getAllCourses();
    Course getCourseById(ObjectId id);
    Course createCourse(Course course);
    Course updateCourse(Course course);
    void deleteCourse(ObjectId id);
}