package ch.supsi.service.folder;

import ch.supsi.model.api.Folder;

import java.util.List;

public interface IFolderService {
    List<Folder> getAllFolders();
    Folder createFolder(Folder folder);
}
