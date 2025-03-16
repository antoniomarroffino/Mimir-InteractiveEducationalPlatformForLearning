package ch.supsi.controller.folder;

import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.service.folder.IFolderService;
import jakarta.annotation.security.RolesAllowed;
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

@Path("/courses/{courseId}/folders")
@RolesAllowed("TEACHER")
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
        List<FolderDTO> foldersDTO = this.folderService.getFoldersInCourse(new ObjectId(courseId));
        return Response.ok(foldersDTO).build();
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
        FolderDTO folderDTO = folderService.getFolderInCourse(
                new ObjectId(courseId),
                new ObjectId(folderId)
        );
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
        FolderDTO createdFolderDTO = this.folderService.addFolderToCourse(new ObjectId(courseId), folderDTO);
        return Response.status(Response.Status.CREATED)
                .entity(createdFolderDTO)
                .build();
    }
}