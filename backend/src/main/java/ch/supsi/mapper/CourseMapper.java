package ch.supsi.mapper;

import ch.supsi.model.api.Course;
import ch.supsi.model.dto.api.CourseDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.stream.Collectors;

@ApplicationScoped
public class CourseMapper implements IBaseMapper<Course, CourseDTO> {

    @Inject
    FolderMapper folderMapper;

    @Override
    public CourseDTO toDTO(Course course) {
        if (course == null) {
            return null;
        }

        CourseDTO dto = new CourseDTO();
        dto.setId(course.id.toString());
        dto.setName(course.name);
        dto.setDescription(course.description);

        dto.setFolders(course.folders.stream()
                .map(this.folderMapper::toDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    @Override
    public Course toEntity(CourseDTO dto) {
        if (dto == null) {
            return null;
        }

        Course course = new Course(dto.getName());
        course.description = dto.getDescription();

        if (dto.getId() != null) {
            course.id = new ObjectId(dto.getId());
        }

        course.folders = dto.getFolders().stream()
                .map(this.folderMapper::toEntity)
                .collect(Collectors.toList());

        return course;
    }
}