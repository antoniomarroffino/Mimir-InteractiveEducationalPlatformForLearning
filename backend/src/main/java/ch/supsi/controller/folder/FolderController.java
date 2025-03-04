package ch.supsi.controller.folder;

import ch.supsi.model.api.Folder;
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
                    schema = @Schema(type = SchemaType.ARRAY, implementation = Folder.class)
            )
    )
    public Response getFolders(@PathParam("courseId") String courseId) {
        return Response.ok(folderService.getFoldersInCourse(new ObjectId(courseId))).build();
    }

    @GET
    @Path("/{folderId}")
    @Operation(summary = "Get specific folder in a course")
    @APIResponse(
            responseCode = "200",
            description = "Folder retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = Folder.class)
            )
    )
    public Response getFolder(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId) {
        return Response.ok(folderService.getFolderInCourse(
                new ObjectId(courseId),
                new ObjectId(folderId)
        )).build();
    }

    @POST
    @Operation(summary = "Create folder in course")
    @APIResponse(
            responseCode = "201",
            description = "Folder created successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = Folder.class)
            )
    )
    public Response createFolder(
            @PathParam("courseId") String courseId,
            @Valid Folder folder) {
        Folder createdFolder = folderService.addFolderToCourse(new ObjectId(courseId), folder);
        return Response.status(Response.Status.CREATED)
                .entity(createdFolder)
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
                    schema = @Schema(implementation = Folder.class)
            )
    )
    public Response updateFolder(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId,
            @Valid Folder folder) {
        return Response.ok(folderService.updateFolderInCourse(
                new ObjectId(courseId),
                new ObjectId(folderId),
                folder
        )).build();
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