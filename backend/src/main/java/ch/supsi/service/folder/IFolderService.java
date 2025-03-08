package ch.supsi.service.folder;

import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.FolderDTO;
import org.bson.types.ObjectId;
import java.util.List;

public interface IFolderService {
    List<FolderDTO> getFoldersInCourse(ObjectId courseId);
    FolderDTO getFolderInCourse(ObjectId courseId, String folderName);
    FolderDTO addFolderToCourse(ObjectId courseId, FolderDTO folderDTO);
}