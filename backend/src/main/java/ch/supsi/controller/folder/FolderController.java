package ch.supsi.controller.folder;

import ch.supsi.model.api.Folder;
import ch.supsi.service.folder.IFolderService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/folders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FolderController {

    @Inject
    IFolderService folderService;

    @GET
    public Response getFolders() {
        List<Folder> folders = this.folderService.getAllFolders();
        return Response.ok(folders).build();
    }

    @POST
    public Response createFolder(@Valid Folder folder) {
        Folder createdFolder = this.folderService.createFolder(folder);
        return Response.status(Response.Status.CREATED)
                .entity(createdFolder)
                .build();
    }
}