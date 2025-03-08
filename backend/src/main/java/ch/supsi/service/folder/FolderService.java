package ch.supsi.service.folder;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
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
    public List<Folder> getFoldersInCourse(ObjectId courseId) {
        Course course = courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }
        return course.getFolders();
    }

    @Override
    public Folder getFolderInCourse(ObjectId courseId, ObjectId folderId) {
        Course course = courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        return course.getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));
    }

    @Override
    public Folder addFolderToCourse(ObjectId courseId, Folder folder) {
        Course course = courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }
        course.getFolders().add(folder);
        courseRepository.update(course);

        return folder;
    }

    @Override
    public Folder updateFolderInCourse(ObjectId courseId, ObjectId folderId, Folder updatedFolder) {
        Course course = courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        List<Folder> folders = course.getFolders();
        for (int i = 0; i < folders.size(); i++) {
            if (folders.get(i).getId().equals(folderId)) {
                folders.set(i, updatedFolder);
                courseRepository.update(course);
                return updatedFolder;
            }
        }

        throw new NotFoundException("Folder not found in course");
    }

    @Override
    public void removeFolderFromCourse(ObjectId courseId, ObjectId folderId) {
        Course course = courseRepository.findById(courseId);
        if (course == null) {
            throw new NotFoundException("Course not found");
        }

        boolean removed = course.getFolders().removeIf(f -> f.getId().equals(folderId));
        if (!removed) {
            throw new NotFoundException("Folder not found in course");
        }

        courseRepository.update(course);
    }
}