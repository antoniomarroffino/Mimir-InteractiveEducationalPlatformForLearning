package ch.supsi.controller.user;


import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.PromotionRequestDTO;
import ch.supsi.service.microsoftGraph.IMicrosoftGraphService;
import ch.supsi.service.user.IUserService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;

import java.util.List;

@Path("/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserController {

    @Inject
    IUserService userService;

    @Inject
    IMicrosoftGraphService microsoftGraphService;

    @PUT
    @Path("/login")
    @RolesAllowed({"TEACHER", "ADMIN"})
    @Operation(summary = "Local login")
    @APIResponse(
            responseCode = "204",
            description = "If user does not exist, he will be created; if user already exist, he will be synchronized with current azure options"
    )
    public Response localLogin() {
        this.microsoftGraphService.getUserByEmail("admin@testforprojectsupsi.onmicrosoft.com");
        //this.userService.synchronizeUser();
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @GET
    @RolesAllowed("ADMIN")
    @Operation(summary = "Get all Users (no admins)")
    @APIResponse(
            responseCode = "204",
            description = "Return all users which are not admin"
    )
    public Response getAllUsers() {
        List<User> users = this.userService.getAllUsers();
        return Response.ok(users).build();
    }

    @PUT
    @Path("/promote")
    @RolesAllowed("ADMIN")
    @Operation(summary = "Promote or Demote users")
    @APIResponse(
            responseCode = "204",
            description = "Admin can promote or demote user from STUDENT to TEACHER and vice versa"
    )
    public Response promoteDemoteUser(PromotionRequestDTO promotionRequestDTO) {
        this.userService.changeRole(promotionRequestDTO);

        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
