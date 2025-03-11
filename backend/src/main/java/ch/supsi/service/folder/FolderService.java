package ch.supsi.service.folder;

import ch.supsi.mapper.FolderMapper;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class FolderService implements IFolderService {

    @Inject
    CourseRepository courseRepository;

    private final FolderMapper folderMapper = FolderMapper.getInstance();

    @Override
    public List<FolderDTO> getFoldersInCourse(ObjectId courseId) {
        Course course = this.courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }
        return course.getFolders().stream()
                .map(folderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FolderDTO getFolderInCourse(ObjectId courseId, ObjectId folderId) {
        Course course = this.courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        return course.getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .map(folderMapper::toDTO)
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));
    }

    @Override
    public FolderDTO addFolderToCourse(ObjectId courseId, FolderDTO folderDTO) {
        Course course = this.courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = folderMapper.toEntity(folderDTO);

        course.getFolders().add(folder);
        this.courseRepository.update(course);

        return folderMapper.toDTO(folder);
    }
}