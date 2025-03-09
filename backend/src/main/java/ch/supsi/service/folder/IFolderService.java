package ch.supsi.service.folder;

import ch.supsi.model.dto.api.FolderDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface IFolderService {
    List<FolderDTO> getFoldersInCourse(ObjectId courseId);

    FolderDTO getFolderInCourse(ObjectId courseId, String folderId);

    FolderDTO addFolderToCourse(ObjectId courseId, FolderDTO folderDTO);
}