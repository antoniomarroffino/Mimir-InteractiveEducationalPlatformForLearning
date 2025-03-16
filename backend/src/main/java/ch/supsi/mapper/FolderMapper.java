package ch.supsi.mapper;

import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.model.dto.api.QuizDTO;
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
            System.err.println("Received null Folder");
            return null;
        }

        try {
            FolderDTO dto = new FolderDTO();
            dto.setId(folder.getId().toString());
            dto.setName(folder.getName());

            System.out.println("Converting folder: " + folder.getName());
            System.out.println("Quizzes count: " + (folder.getQuizzes() != null ? folder.getQuizzes().size() : "null"));

            if (folder.getQuizzes() != null) {
                dto.setQuizzes(folder.getQuizzes().stream()
                        .map(quiz -> {
                            try {
                                QuizDTO quizDTO = quizMapper.toDTO(quiz);
                                System.out.println("  Converted quiz: " + quiz.getName());
                                System.out.println("  Questions count: " + (quiz.getQuestions() != null ? quiz.getQuestions().size() : "null"));
                                return quizDTO;
                            } catch (Exception e) {
                                System.err.println("Error converting quiz: " + quiz.getName());
                                e.printStackTrace();
                                throw e;
                            }
                        })
                        .collect(Collectors.toList()));
            }

            return dto;
        } catch (Exception e) {
            System.err.println("Error converting Folder to DTO for folder: " + folder.getName());
            e.printStackTrace();
            throw new RuntimeException("Failed to convert Folder to DTO", e);
        }
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