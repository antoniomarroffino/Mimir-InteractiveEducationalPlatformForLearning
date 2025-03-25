package ch.supsi.service.folder;

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
        return courseOpt.get().folders.stream()
                .map(this.folderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FolderDTO getFolderInCourse(ObjectId courseId, ObjectId folderId) {
        Optional<Course> courseOpt = this.courseRepository.findByIdOptional(courseId);
        if (courseOpt.isEmpty()) {
            throw new NotFoundException("Course " + courseId + " not found");
        }

        return courseOpt.get().folders.stream()
                .filter(f -> f.id.equals(folderId))
                .map(this.folderMapper::toDTO)
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

        Folder folder = this.folderMapper.toEntity(folderDTO);

        course.folders.add(folder);
        this.courseRepository.update(course);

        return this.folderMapper.toDTO(folder);
    }


    @Override
    public FolderDTO updateFolder(ObjectId courseId, ObjectId folderId, FolderDTO folderDTO) {
        Course course = this.courseRepository.findByIdOptional(courseId)
                .orElseThrow(() -> new NotFoundException("Course " + courseId + " not found"));

        Folder folderToUpdate = course.folders.stream()
                .filter(f -> f.id.equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder " + folderId + " not found"));

        this.verifyFolderIsValid(course, folderDTO.getName(), folderToUpdate.id);
        folderToUpdate.name = folderDTO.getName();

        this.courseRepository.update(course);
        return this.folderMapper.toDTO(folderToUpdate);
    }

    @Override
    public void deleteFolder(ObjectId courseId, ObjectId folderId) {
        Course course = this.courseRepository.findByIdOptional(courseId)
                .orElseThrow(() -> new NotFoundException("Course " + courseId + " not found"));

        boolean removed = course.folders.removeIf(f -> f.id.equals(folderId));

        if (!removed) {
            throw new NotFoundException("Folder " + folderId + " not found");
        }

        this.courseRepository.update(course);
    }


    private void verifyFolderIsValid(Course course, FolderDTO folderDTO) {
        if (folderDTO == null) {
            throw new BadRequestException("Folder data cannot be null");
        }
        this.verifyFolderIsValid(course, folderDTO.getName(), null);
    }

    private void verifyFolderIsValid(Course course, String folderName, ObjectId excludeFolderId) {
        if (folderName == null || folderName.isBlank()) {
            throw new BadRequestException("Folder name cannot be empty");
        }

        boolean nameExists = course.folders.stream()
                .filter(f -> !f.id.equals(excludeFolderId))
                .anyMatch(f -> f.name.equalsIgnoreCase(folderName.trim()));

        if (nameExists) {
            throw new BadRequestException("Folder name '" + folderName + "' already exists in this course");
        }
    }
}