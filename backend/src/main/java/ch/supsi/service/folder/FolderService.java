package ch.supsi.service.folder;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.repository.CourseRepository;
import ch.supsi.repository.FolderRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import java.util.List;
@ApplicationScoped
public class FolderService implements IFolderService {

    @Inject
    CourseRepository courseRepository;

    @Inject
    FolderRepository folderRepository;

    @Override
    public List<FolderDTO> getFoldersInCourse(ObjectId courseId) {
        Course course = this.courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }
        return course.getFolders().stream().map(new FolderDTO()::fromEntity).toList();
    }

    @Override
    public FolderDTO getFolderInCourse(ObjectId courseId, ObjectId folderId) {
        Course course = this.courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        return course.getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .map(new FolderDTO()::fromEntity)
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));
    }

    @Override
    public FolderDTO addFolderToCourse(ObjectId courseId, FolderDTO folderDTO) {
        Course course = this.courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        Folder folder = folderDTO.toEntity();
        folder.setId(this.createNewFolderId());

        course.getFolders().add(folder);
        this.courseRepository.update(course);

        return new FolderDTO().fromEntity(folder);
    }

    private ObjectId createNewFolderId() {
        ObjectId folderId;
        do{
            folderId = new ObjectId();
        }while (this.folderRepository.findById(folderId) != null);
        return folderId;
    }
}