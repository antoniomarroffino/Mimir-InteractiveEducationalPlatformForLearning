package ch.supsi.service.folder;

import ch.supsi.model.api.Folder;
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