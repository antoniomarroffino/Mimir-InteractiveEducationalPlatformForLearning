package ch.supsi.mapper;

import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.FolderDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.stream.Collectors;

@ApplicationScoped
public class FolderMapper implements BaseMapper<Folder, FolderDTO> {

    @Inject
    QuizMapper quizMapper;

    @Override
    public FolderDTO toDTO(Folder folder) {
        if (folder == null) {
            return null;
        }

        FolderDTO dto = new FolderDTO();
        dto.setId(folder.getId() != null ? folder.getId().toString() : null);
        dto.setName(folder.getName());

        dto.setQuizzes(folder.getQuizzes().stream()
                .map(quizMapper::toDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    @Override
    public Folder toEntity(FolderDTO dto) {
        if (dto == null) {
            return null;
        }

        Folder folder = new Folder(dto.getName());

        if (dto.getId() != null) {
            folder.setId(new ObjectId(dto.getId()));
        }

        if (dto.getQuizzes() != null) {
            folder.setQuizzes(dto.getQuizzes().stream()
                    .map(quizMapper::toEntity)
                    .collect(Collectors.toList()));
        }

        return folder;
    }
}