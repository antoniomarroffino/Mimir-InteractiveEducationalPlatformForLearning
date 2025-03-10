package ch.supsi.controller.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.service.user.IUserService;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;

@Path("/user")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserController {

    @Inject
    IUserService userService;

    @Inject
    SecurityIdentity securityIdentity;

    @POST
    @Path("/login")
    @Authenticated
    @Operation(summary = "Local login")
    @APIResponse(
            responseCode = "201",
            description = "If user does not exist, he will created; if user already exist check for personal update"
    )
    public Response localLogin(){
        this.userService.updateUser((JsonWebToken) securityIdentity.getPrincipal());

        return Response.status(Response.Status.CREATED).build();
    }

    @GET
    @Path("/admin")
    @RolesAllowed("ADMIN")
    @Operation(summary = "Admin Resource")
    @APIResponse(
            responseCode = "200",
            description = "Resource admin"
    )
    public Response adminResource(){
        return Response.status(Response.Status.OK).build();
    }

    @GET
    @Path("/student")
    @RolesAllowed("STUDENT")
    @Operation(summary = "student Resource")
    @APIResponse(
            responseCode = "200",
            description = "Resource student"
    )
    public Response studentResource(){
        return Response.status(Response.Status.OK).build();
    }
}
