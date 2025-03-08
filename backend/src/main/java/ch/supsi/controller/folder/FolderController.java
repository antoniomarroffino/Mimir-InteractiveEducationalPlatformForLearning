package ch.supsi.controller.folder;

import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.service.folder.IFolderService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;

import java.util.List;
import java.util.stream.Collectors;

@Path("/courses/{courseId}/folders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FolderController {

    @Inject
    IFolderService folderService;

    @GET
    @Operation(summary = "Get all folders in a course")
    @APIResponse(
            responseCode = "200",
            description = "List of folders retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(type = SchemaType.ARRAY, implementation = FolderDTO.class)
            )
    )
    public Response getFolders(@PathParam("courseId") String courseId) {
        List<Folder> folders = folderService.getFoldersInCourse(new ObjectId(courseId));
        List<FolderDTO> folderDTOs = folders.stream()
                .map(FolderDTO::fromEntity)
                .collect(Collectors.toList());
        return Response.ok(folderDTOs).build();
    }

    @GET
    @Path("/{folderId}")
    @Operation(summary = "Get specific folder in a course")
    @APIResponse(
            responseCode = "200",
            description = "Folder retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = FolderDTO.class)
            )
    )
    public Response getFolder(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId) {
        Folder folder = folderService.getFolderInCourse(
                new ObjectId(courseId),
                new ObjectId(folderId)
        );
        FolderDTO folderDTO = FolderDTO.fromEntity(folder);
        return Response.ok(folderDTO).build();
    }

    @POST
    @Operation(summary = "Create folder in course")
    @APIResponse(
            responseCode = "201",
            description = "Folder created successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = FolderDTO.class)
            )
    )
    public Response createFolder(
            @PathParam("courseId") String courseId,
            @Valid FolderDTO folderDTO) {
        Folder folder = folderDTO.toEntity();
        Folder createdFolder = folderService.addFolderToCourse(new ObjectId(courseId), folder);
        FolderDTO createdFolderDTO = FolderDTO.fromEntity(createdFolder);
        return Response.status(Response.Status.CREATED)
                .entity(createdFolderDTO)
                .build();
    }

    @PUT
    @Path("/{folderId}")
    @Operation(summary = "Update folder in course")
    @APIResponse(
            responseCode = "200",
            description = "Folder updated successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = FolderDTO.class)
            )
    )
    public Response updateFolder(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId,
            @Valid FolderDTO folderDTO) {
        Folder folder = folderDTO.toEntity();
        Folder updatedFolder = folderService.updateFolderInCourse(
                new ObjectId(courseId),
                new ObjectId(folderId),
                folder
        );
        FolderDTO updatedFolderDTO = FolderDTO.fromEntity(updatedFolder);
        return Response.ok(updatedFolderDTO).build();
    }

    @DELETE
    @Path("/{folderId}")
    @Operation(summary = "Delete folder from course")
    @APIResponse(
            responseCode = "204",
            description = "Folder deleted successfully"
    )
    public Response deleteFolder(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId) {
        folderService.removeFolderFromCourse(
                new ObjectId(courseId),
                new ObjectId(folderId)
        );
        return Response.noContent().build();
    }
}