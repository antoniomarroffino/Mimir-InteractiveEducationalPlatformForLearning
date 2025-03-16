package ch.supsi.service.folder;

import ch.supsi.mapper.CourseMapper;
import ch.supsi.mapper.FolderMapper;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Optional;

import java.util.stream.Collectors;

@ApplicationScoped
public class FolderService implements IFolderService {

    @Inject
    CourseRepository courseRepository;

    @Inject
    FolderMapper folderMapper;

    @Override
    public List<FolderDTO> getFoldersInCourse(ObjectId courseId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course " + courseId + " not found");
        }
        return course.getFolders().stream()
                .map(folderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FolderDTO getFolderInCourse(ObjectId courseId, String folderId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course " + courseId + " not found");
        }

        return course.getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .map(folderMapper::toDTO)
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

        Folder folder = folderMapper.toEntity(folderDTO);

        course.getFolders().add(folder);
        this.courseRepository.update(course);

        return folderMapper.toDTO(folder);
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