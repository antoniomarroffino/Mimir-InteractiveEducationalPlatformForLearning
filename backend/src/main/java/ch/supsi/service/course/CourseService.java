package ch.supsi.service.course;

import ch.supsi.exception.api.BadRequestException;
import ch.supsi.exception.api.NotFoundException;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class CourseService implements ICourseService {

    @Inject
    CourseRepository courseRepository;

    @Override
    public List<CourseDTO> getAllCourses() {
        return this.courseRepository.listAll().stream()
                .map(new CourseDTO()::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDTO getCourseById(ObjectId id) {
        Course course = this.courseRepository.findById(id);
        if (course == null) {
            throw new NotFoundException("Course " + id + " not found");
        }
        return new CourseDTO().fromEntity(course);
    }

    @Override
    public CourseDTO createCourse(CourseDTO courseDTO) {
        this.verifyCourseIsValid(courseDTO);

        Course course = courseDTO.toEntity();
        this.courseRepository.persist(course);

        return courseDTO.fromEntity(course);
    }

    private void verifyCourseIsValid(CourseDTO courseDTO) {
        if(courseDTO == null)
            throw new BadRequestException("Course is null");

        String courseName = courseDTO.getName();

        if(this.isCourseNameDuplicated(courseName))
            throw new BadRequestException("Course name " + courseName + " already existing");
    }

    private boolean isCourseNameDuplicated(String courseName) {
        for(Course course : this.courseRepository.listAll())
            if(course.getName().equals(courseName))
                return true;

        return false;
    }
}