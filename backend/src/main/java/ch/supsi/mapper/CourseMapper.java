package ch.supsi.mapper;

import ch.supsi.model.api.Course;
import ch.supsi.model.dto.api.CourseDTO;
import org.bson.types.ObjectId;

import java.util.stream.Collectors;

public class CourseMapper implements BaseMapper<Course, CourseDTO> {
    private static CourseMapper instance;
    private final FolderMapper folderMapper;

    private CourseMapper() {
        this.folderMapper = FolderMapper.getInstance();
    }

    public static CourseMapper getInstance() {
        return instance == null ? instance = new CourseMapper() : instance;
    }

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