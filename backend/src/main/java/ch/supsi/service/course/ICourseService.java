package ch.supsi.service.course;

import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.CourseDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface ICourseService {
    List<CourseDTO> getAllCourses(User currentUser);

    CourseDTO getCourseById(ObjectId id);

    CourseDTO createCourse(CourseDTO course, User currentUser);

    void assignCourse(ObjectId id, User currentUser);
}