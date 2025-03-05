package ch.supsi.repository;

import ch.supsi.model.api.Folder;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FolderRepository implements PanacheMongoRepository<Folder> {
}