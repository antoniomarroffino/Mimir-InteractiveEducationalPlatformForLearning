package ch.supsi.service.course;

import ch.supsi.model.dto.api.CourseDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface ICourseService {
    List<CourseDTO> getAllCourses();

    CourseDTO getCourseById(ObjectId id);

    CourseDTO createCourse(CourseDTO course);
}