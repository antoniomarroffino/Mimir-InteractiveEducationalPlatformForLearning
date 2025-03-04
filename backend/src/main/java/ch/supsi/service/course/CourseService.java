package ch.supsi.service.course;

import ch.supsi.exception.api.NotFoundException;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class CourseService implements ICourseService {
    @Override
    public List<Course> getAllCourses() {
        return Course.listAll();
    }

    @Override
    public Course createCourse(Course course) {
        course.persist();
        return course;
    }

    @Override
    public List<Folder> getAllFoldersOfACourse(String idCourse) {
        Optional<Course> course = Course.findByIdOptional(new ObjectId(idCourse));

        if(course.isEmpty())
            throw new NotFoundException("Course not found with id: " + idCourse);

        return course.get().getFolders();
    }
}
