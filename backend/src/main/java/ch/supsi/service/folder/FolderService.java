package ch.supsi.service.folder;

import ch.supsi.exception.api.BadRequestException;
import ch.supsi.exception.api.NotFoundException;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import java.util.List;
@ApplicationScoped
public class FolderService implements IFolderService {

    @Inject
    CourseRepository courseRepository;

    @Override
    public List<FolderDTO> getFoldersInCourse(ObjectId courseId) {
        Course course = this.courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course " + courseId + " not found");
        }
        return course.getFolders().stream().map(new FolderDTO()::fromEntity).toList();
    }

    @Override
    public FolderDTO getFolderInCourse(ObjectId courseId, String folderName) {
        Course course = this.courseRepository.findById(courseId);
        if (course == null)
            throw new NotFoundException("Course " + courseId + " not found");

        if(folderName == null || folderName.isEmpty())
            throw new BadRequestException("Folder name cannot be null or empty");

        return course.getFolders().stream()
                .filter(f -> f.getName().equals(folderName))
                .map(new FolderDTO()::fromEntity)
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder " + folderName + " not found in course: " + courseId));
    }

    @Override
    public FolderDTO addFolderToCourse(ObjectId courseId, FolderDTO folderDTO) {
        Course course = this.courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course " + courseId + " not found");
        }

        this.verifyFolderIsValid(course, folderDTO);

        Folder folder = folderDTO.toEntity();
        course.getFolders().add(folder);
        this.courseRepository.update(course);

        return folderDTO.fromEntity(folder);
    }

    private void verifyFolderIsValid(Course course, FolderDTO folderDTO) {
        if(folderDTO == null)
            throw new BadRequestException("Folder is null");

        String folderName = folderDTO.getName();

        if(this.isFolderNameDuplicated(course, folderName))
            throw new BadRequestException("Folder name " + folderName + " already existing in course " + course.getId());
    }

    private boolean isFolderNameDuplicated(Course course, String folderName) {
        for(Folder folder : course.getFolders())
            if(folder.getName().equals(folderName))
                return true;

        return false;
    }
}