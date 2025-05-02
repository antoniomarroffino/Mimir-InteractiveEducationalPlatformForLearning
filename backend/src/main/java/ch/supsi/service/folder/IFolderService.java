package ch.supsi.service.folder;

import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface IFolderService {
    List<FolderDTO> getFoldersInCourse(CourseDTO courseDTO);

    FolderDTO getFolderInCourse(CourseDTO courseDTO, ObjectId folderId);

    FolderDTO addFolderToCourse(CourseDTO courseDTO, FolderDTO folderDTO);

    FolderDTO updateFolder(CourseDTO courseDTO, ObjectId folderId, FolderDTO folderDTO);

    void deleteFolder(CourseDTO courseDTO, ObjectId folderId);
}