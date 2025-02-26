package ch.supsi.service;

import ch.supsi.model.Folder;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class FolderService implements IFolderService {

    @Override
    public List<Folder> getAllFolders() {
        return Folder.listAll();
    }

    @Override
    public Folder createFolder(Folder folder) {
        folder.persist();
        return folder;
    }
}