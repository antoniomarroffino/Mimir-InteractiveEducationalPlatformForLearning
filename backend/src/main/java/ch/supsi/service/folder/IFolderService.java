package ch.supsi.service.folder;

import ch.supsi.model.api.Folder;
import org.bson.types.ObjectId;
import java.util.List;

public interface IFolderService {
    List<Folder> getFoldersInCourse(ObjectId courseId);
    Folder getFolderInCourse(ObjectId courseId, ObjectId folderId);
    Folder addFolderToCourse(ObjectId courseId, Folder folder);
    Folder updateFolderInCourse(ObjectId courseId, ObjectId folderId, Folder folder);
    void removeFolderFromCourse(ObjectId courseId, ObjectId folderId);
}