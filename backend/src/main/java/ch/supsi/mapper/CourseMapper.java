package ch.supsi.mapper;

import ch.supsi.model.api.Course;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
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
            System.err.println("Received null Course");
            return null;
        }

        try {
            CourseDTO dto = new CourseDTO();
            dto.setId(course.getId().toString());
            dto.setName(course.getName());

            if (course.getFolders() != null) {
                dto.setFolders(course.getFolders().stream()
                        .map(folder -> {
                            try {
                                return folderMapper.toDTO(folder);
                            } catch (Exception e) {
                                System.err.println("Error converting folder: " + folder.getName());
                                e.printStackTrace();
                                throw e;
                            }
                        })
                        .collect(Collectors.toList()));
            }

            return dto;
        } catch (Exception e) {
            System.err.println("Error converting Course to DTO for course: " + course.getName());
            e.printStackTrace();
            throw new RuntimeException("Failed to convert Course to DTO", e);
        }
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