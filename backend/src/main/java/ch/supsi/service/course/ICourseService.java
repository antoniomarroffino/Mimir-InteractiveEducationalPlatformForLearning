package ch.supsi.service.course;

import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.CourseDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface ICourseService {
    List<CourseDTO> getAllCourses(User user);

    CourseDTO getCourseById(ObjectId id);

    CourseDTO createCourse(CourseDTO courseDTO, User currentUser);

    CourseDTO updateCourse(ObjectId id, CourseDTO courseDTO, User currentUser);

    void deleteCourse(ObjectId id, User currentUser);

    void assignCourse(ObjectId id, User currentUser);
}