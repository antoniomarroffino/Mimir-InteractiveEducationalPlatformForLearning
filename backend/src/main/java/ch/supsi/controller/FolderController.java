package ch.supsi.controller;

import ch.supsi.model.Folder;
import ch.supsi.service.IFolderService;
import jakarta.inject.Inject;
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
        try {
            List<Folder> folders = this.folderService.getAllFolders();
            return Response.ok(folders).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(e.getMessage())
                    .build();
        }
    }

    @POST
    public Response createFolder(Folder folder) {
        try {

            //TODO: Da cambiare al più presto con gestione ottimizzata eccezioni
            if (folder == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("folder is null")
                        .build();
            }
            if (folder.getName() == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("folder name is null")
                        .build();
            }
            if (folder.getName().trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("folder name is empty")
                        .build();
            }

            Folder createdFolder = this.folderService.createFolder(folder);
            return Response.status(Response.Status.CREATED)
                    .entity(createdFolder)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(e.getMessage())
                    .build();
        }
    }
}