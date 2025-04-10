package ch.supsi.service.folder;

import ch.supsi.mapper.CourseMapper;
import ch.supsi.mapper.FolderMapper;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.repository.CourseRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class FolderService implements IFolderService {
    @Inject
    CourseRepository courseRepository;

    @Inject
    CourseMapper courseMapper;

    @Inject
    FolderMapper folderMapper;

    @Override
    public List<FolderDTO> getFoldersInCourse(CourseDTO courseDTO) {
        this.verifyCourseDTOIsValid(courseDTO);
        return this.courseMapper.toEntity(courseDTO)
                .folders.stream()
                .map(this.folderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FolderDTO getFolderInCourse(CourseDTO courseDTO, ObjectId folderId) {
        this.verifyCourseDTOIsValid(courseDTO);
        Course course = this.courseMapper.toEntity(courseDTO);
        Folder folder = this.findFolderInCourseById(course, folderId);
        return this.folderMapper.toDTO(folder);
    }

    @Override
    public FolderDTO addFolderToCourse(CourseDTO courseDTO, FolderDTO folderDTO) {
        this.verifyCourseDTOIsValid(courseDTO);

        Course course = this.courseMapper.toEntity(courseDTO);

        this.verifyFolderIsValid(course, folderDTO);

        Folder folder = this.folderMapper.toEntity(folderDTO);

        course.folders.add(folder);
        this.courseRepository.update(course);

        return this.folderMapper.toDTO(folder);
    }


    @Override
    public FolderDTO updateFolder(CourseDTO courseDTO, ObjectId folderId, FolderDTO folderDTO) {
        this.verifyCourseDTOIsValid(courseDTO);
        Course course = this.courseMapper.toEntity(courseDTO);

        Folder folderToUpdate = this.findFolderInCourseById(course, folderId);

        this.verifyFolderNameIsDuplicated(course, folderDTO.getName());

        folderToUpdate.name = folderDTO.getName();

        this.courseRepository.update(course);
        return this.folderMapper.toDTO(folderToUpdate);
    }

    @Override
    public void deleteFolder(CourseDTO courseDTO, ObjectId folderId) {
        this.verifyCourseDTOIsValid(courseDTO);
        Course course = this.courseMapper.toEntity(courseDTO);

        boolean removed = course.folders.removeIf(f -> f.id.equals(folderId));

        if (!removed)
            throw new NotFoundException("Folder " + folderId + " not found");

        this.courseRepository.update(course);
    }

    private Folder findFolderInCourseById(Course course, ObjectId folderId) {
        return course.folders.stream()
                .filter(f -> f.id.equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder " + folderId + " not found"));
    }

    private void verifyCourseDTOIsValid(CourseDTO courseDTO) {
        if (courseDTO == null)
            throw new BadRequestException("Course passed is null");
    }

    private void verifyFolderIsValid(Course course, FolderDTO folderDTO) {
        if (folderDTO == null) {
            throw new BadRequestException("Folder data cannot be null");
        }

        String folderName = folderDTO.getName().trim();
        if (folderName.isBlank()) {
            throw new BadRequestException("Folder name cannot be empty");
        }

        this.verifyFolderNameIsDuplicated(course, folderDTO.getName());
    }

    private void verifyFolderNameIsDuplicated(Course course, String folderName) {
        boolean isNameDuplicated = course.folders.stream()
                .anyMatch(f -> f.name.equalsIgnoreCase(folderName.trim()));

        if (isNameDuplicated) {
            throw new BadRequestException("Folder name " + folderName + " already exists in this course");
        }
    }
}