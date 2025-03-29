package ch.supsi.mapper;

import ch.supsi.mapper.quiz.QuizMapper;
import ch.supsi.mapper.quiz.facade.IQuizMapperFacade;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.FolderDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.stream.Collectors;

@ApplicationScoped
public class FolderMapper implements IBaseMapper<Folder, FolderDTO> {

    @Inject
    IQuizMapperFacade quizMapperFacade;

    @Override
    public FolderDTO toDTO(Folder folder) {
        if (folder == null) {
            return null;
        }

        FolderDTO dto = new FolderDTO();
        dto.setId(folder.id.toString());
        dto.setName(folder.name);

        if (folder.quizzes != null) {
            dto.setQuizzes(folder.quizzes.stream()
                    .map(this.quizMapperFacade::toDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    @Override
    public Folder toEntity(FolderDTO dto) {
        if (dto == null) {
            return null;
        }

        Folder folder = new Folder(dto.getName());

        if (dto.getId() != null) {
            folder.id = new ObjectId(dto.getId());
        }

        if (dto.getQuizzes() != null) {
            folder.quizzes = dto.getQuizzes().stream()
                    .map(this.quizMapperFacade::toEntity)
                    .collect(Collectors.toList());
        }

        return folder;
    }
}