package ch.supsi.service.course;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;

import java.util.List;

public interface ICourseService {
    List<Course> getAllCourses();
    Course createCourse(Course course);
    List<Folder> getAllFoldersOfACourse(String idCourse);
}
