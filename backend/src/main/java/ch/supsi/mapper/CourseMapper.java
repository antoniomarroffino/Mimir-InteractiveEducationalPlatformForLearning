package ch.supsi.mapper;

import ch.supsi.model.api.Course;
import ch.supsi.model.dto.api.CourseDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.stream.Collectors;

@ApplicationScoped
public class CourseMapper implements BaseMapper<Course, CourseDTO> {

    @Inject
    FolderMapper folderMapper;

    @Override
    public CourseDTO toDTO(Course course) {
        if (course == null) {
            return null;
        }

        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId() != null ? course.getId().toString() : null);
        dto.setName(course.getName());

        dto.setFolders(course.getFolders().stream()
                .map(folderMapper::toDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    @Override
    public Course toEntity(CourseDTO dto) {
        if (dto == null) {
            return null;
        }

        Course course = new Course(dto.getName());

        if (dto.getId() != null) {
            course.setId(new ObjectId(dto.getId()));
        }

        if (dto.getFolders() != null) {
            course.setFolders(dto.getFolders().stream()
                    .map(folderMapper::toEntity)
                    .collect(Collectors.toList()));
        }

        return course;
    }
}