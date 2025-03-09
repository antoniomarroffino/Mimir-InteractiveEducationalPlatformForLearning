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
import java.util.Optional;

@ApplicationScoped
public class FolderService implements IFolderService {

    @Inject
    CourseRepository courseRepository;

    @Override
    public List<FolderDTO> getFoldersInCourse(ObjectId courseId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course " + courseId + " not found");
        }
        return courseOpt.get().getFolders().stream().map(new FolderDTO()::fromEntity).toList();
    }

    @Override
    public FolderDTO getFolderInCourse(ObjectId courseId, String folderId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course " + courseId + " not found");
        }

        return courseOpt.get().getFolders().stream()
                .filter(f -> f.getId().toString().equals(folderId))
                .map(new FolderDTO()::fromEntity)
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder " + folderId + " not found in course: " + courseId));
    }

    @Override
    public FolderDTO addFolderToCourse(ObjectId courseId, FolderDTO folderDTO) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course " + courseId + " not found");
        }

        Course course = courseOpt.get();

        this.verifyFolderIsValid(course, folderDTO);

        Folder folder = folderDTO.toEntity();
        course.getFolders().add(folder);
        this.courseRepository.update(course);

        return folderDTO.fromEntity(folder);
    }

    private void verifyFolderIsValid(Course course, FolderDTO folderDTO) {
        if (folderDTO == null)
            throw new BadRequestException("Folder is null");

        String folderName = folderDTO.getName();

        if (this.isFolderNameDuplicated(course, folderName))
            throw new BadRequestException("Folder name " + folderName + " already existing in course " + course.getId());
    }

    private boolean isFolderNameDuplicated(Course course, String folderName) {
        for (Folder folder : course.getFolders())
            if (folder.getName().equals(folderName))
                return true;

        return false;
    }
}