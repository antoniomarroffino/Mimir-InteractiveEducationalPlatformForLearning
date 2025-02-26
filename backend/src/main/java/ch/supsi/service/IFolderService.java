package ch.supsi.service;

import ch.supsi.model.Folder;

import java.util.List;

public interface IFolderService {
    List<Folder> getAllFolders();
    Folder createFolder(Folder folder);
}
