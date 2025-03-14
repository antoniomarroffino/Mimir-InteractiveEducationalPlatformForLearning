package ch.supsi.controller.user;


import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.PromotionRequestDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.service.user.IUserService;
import ch.supsi.service.user.microsoftGraph.IMicrosoftGraphService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
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

    @GET
    @RolesAllowed("ADMIN")
    @Operation(summary = "Get all Users (no admins)")
    @APIResponse(
            responseCode = "200",
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
    public Response promoteDemoteUser(@Valid PromotionRequestDTO promotionRequestDTO) {
        this.userService.changeRole(
                this.microsoftGraphService.getUserByEmail(promotionRequestDTO.getEmail()),
                promotionRequestDTO.getRole()
        );

        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @GET
    @Path("/me")
    @RolesAllowed({"STUDENT", "TEACHER", "ADMIN"})
    @Operation(summary = "Get user by azure oid")
    @APIResponse(
            responseCode = "200",
            description = "Return user given oid"
    )
    public Response getUser() {
        String oid = this.userService.getOidFromJWT();
        UserWithoutCoursesDTO userDTO = this.userService.buildUserWithoutCoursesDTO(this.microsoftGraphService.getUserByOid(oid));
        return Response.ok(userDTO).build();
    }
}
