package ch.supsi.controller.badgeholder;

import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.dto.api.BadgeHolderDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.service.badgeholder.IBadgeHolderService;
import ch.supsi.service.user.IUserService;
import ch.supsi.service.user.microsoftGraph.IMicrosoftGraphService;
import jakarta.annotation.security.RolesAllowed;
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

@Path("/badge-holders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BadgeHolderController {
    @Inject
    IBadgeHolderService badgeHolderService;

    @Inject
    IMicrosoftGraphService microsoftGraphService;

    @Inject
    IUserService userService;

    @GET
    @RolesAllowed("TEACHER")
    @Operation(summary = "Get all badge holders")
    @APIResponse(
            responseCode = "200",
            description = "List of badge holders retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(type = SchemaType.ARRAY, implementation = BadgeHolderDTO.class)
            )
    )
    public Response getAllBadgeHolders() {
        List<BadgeHolderDTO> badgeHoldersDTO = this.badgeHolderService.getAllBadgeHolders();
        badgeHoldersDTO
                .forEach(badgeHolderDTO -> badgeHolderDTO.setUser(
                                this.buildUserWithoutCoursesDTOFromBadgeHolderDTO(badgeHolderDTO)
                        )
                );
        return Response.ok(badgeHoldersDTO).build();
    }

    @GET
    @Path("/{azureOID}")
    @Operation(summary = "Get badge holder by Azure OID")
    @APIResponse(
            responseCode = "200",
            description = "Badge holder retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = BadgeHolderDTO.class)
            )
    )
    @APIResponse(
            responseCode = "404",
            description = "Badge holder not found"
    )
    public Response getBadgeHolder(@PathParam("azureOID") String azureOID) {
        BadgeHolderDTO badgeHolderDTO = this.badgeHolderService.getBadgeHolderByAzureOID(azureOID);
        badgeHolderDTO.setUser(this.buildUserWithoutCoursesDTOFromBadgeHolderDTO(badgeHolderDTO));
        return Response.ok(badgeHolderDTO).build();
    }

    @POST
    @Path("/{azureOID}/badges")
    @RolesAllowed("TEACHER")
    @Operation(summary = "Assign a badge to a student")
    @APIResponse(
            responseCode = "204",
            description = "Badge assigned successfully"
    )
    public Response assignBadge(
            @PathParam("azureOID") String azureOID,
            @Valid Badge badge
    ) {
        this.badgeHolderService.addBadgeToHolder(azureOID, badge);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    private UserWithoutCoursesDTO buildUserWithoutCoursesDTOFromBadgeHolderDTO(BadgeHolderDTO badgeHolderDTO) {
        return this.userService.buildUserWithoutCoursesDTO(
                this.microsoftGraphService.getUserByOid(badgeHolderDTO.getUser().getAzureOid())
        );
    }
}