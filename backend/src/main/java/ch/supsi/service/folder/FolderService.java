package ch.supsi.service.folder;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.service.course.ICourseService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import java.util.List;

@ApplicationScoped
public class FolderService implements IFolderService {

    @Inject
    ICourseService courseService;

    @Override
    public List<Folder> getFoldersInCourse(ObjectId courseId) {
        Course course = courseService.getCourseById(courseId);
        return course.getFolders();
    }

    @Override
    public Folder getFolderInCourse(ObjectId courseId, ObjectId folderId) {
        Course course = courseService.getCourseById(courseId);
        return course.getFolders().stream()
                .filter(f -> f.getId().equals(folderId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Folder not found in course"));
    }

    @Override
    public Folder addFolderToCourse(ObjectId courseId, Folder folder) {
        Course course = courseService.getCourseById(courseId);
        course.getFolders().add(folder);
        course.update();
        return folder;
    }

    @Override
    public Folder updateFolderInCourse(ObjectId courseId, ObjectId folderId, Folder updatedFolder) {
        Course course = courseService.getCourseById(courseId);
        List<Folder> folders = course.getFolders();

        for (int i = 0; i < folders.size(); i++) {
            if (folders.get(i).getId().equals(folderId)) {
                folders.set(i, updatedFolder);
                course.update();
                return updatedFolder;
            }
        }
        throw new NotFoundException("Folder not found in course");
    }

    @Override
    public void removeFolderFromCourse(ObjectId courseId, ObjectId folderId) {
        Course course = courseService.getCourseById(courseId);
        boolean removed = course.getFolders().removeIf(f -> f.getId().equals(folderId));
        if (!removed) {
            throw new NotFoundException("Folder not found in course");
        }
        course.update();
    }
}