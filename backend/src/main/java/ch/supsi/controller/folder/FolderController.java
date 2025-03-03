package ch.supsi.controller.folder;

import ch.supsi.model.api.Folder;
import ch.supsi.service.folder.IFolderService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;

import java.util.List;

@Path("/folders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FolderController {

    @Inject
    IFolderService folderService;

    @GET
    @Operation(summary = "Get all folders")
    @APIResponse(
            responseCode = "200",
            description = "List of folders retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(type = SchemaType.ARRAY, implementation = Folder.class)
            )
    )
    public Response getFolders() {
        List<Folder> folders = this.folderService.getAllFolders();
        return Response.ok(folders).build();
    }

    @POST
    @Operation(summary = "Create folder")
    @APIResponse(
            responseCode = "201",
            description = "Folder created successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = Folder.class)
            )
    )
    public Response createFolder(@Valid Folder folder) {
        Folder createdFolder = this.folderService.createFolder(folder);
        return Response.status(Response.Status.CREATED)
                .entity(createdFolder)
                .build();
    }
}