package ch.supsi.controller.quizattempt;

import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.service.quizattempt.IQuizAttemptService;
import ch.supsi.service.user.IUserService;
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

@Path("/attempts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuizAttemptController {

    @Inject
    IQuizAttemptService quizAttemptService;

    @Inject
    IUserService userService;

    @GET
    @RolesAllowed({"STUDENT","TEACHER"})
    @Path("/user/{userAzureOID}")
    @Operation(summary = "Get all quiz attempts for a specific user")
    @APIResponse(
            responseCode = "200",
            description = "List of quiz attempts for the user",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(type = SchemaType.ARRAY, implementation = QuizAttemptDTO.class)
            )
    )
    @APIResponse(
            responseCode = "400",
            description = "Invalid user ID format"
    )
    @APIResponse(
            responseCode = "404",
            description = "User not found"
    )
    public Response getQuizAttemptsByUser(@PathParam("userAzureOID") String userAzureOID) {
        List<QuizAttemptDTO> attempts = this.quizAttemptService.getQuizAttemptsByUser(userAzureOID);
        return Response.ok(attempts).build();
    }

    @POST
    @RolesAllowed({"STUDENT","TEACHER"})
    @Operation(summary = "Create a new quiz attempt")
    @APIResponse(responseCode = "201", description = "Quiz attempt created successfully", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(type = SchemaType.OBJECT, implementation = QuizAttemptDTO.class)
    ))
    @APIResponse(responseCode = "400", description = "Invalid input data")
    @APIResponse(responseCode = "404", description = "Resource not found")
    public Response createQuizAttempt(@Valid QuizAttemptDTO quizAttemptDTO) {
        QuizAttemptDTO responseDTO = this.quizAttemptService.createQuizAttempt(quizAttemptDTO);
        return Response.status(Response.Status.CREATED).entity(responseDTO).build();
    }

    @GET
    @Path("/{attemptId}")
    @RolesAllowed("TEACHER")
    @Operation(summary = "Get quiz attempt by ID")
    @APIResponse(responseCode = "200", description = "Quiz attempt found", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(implementation = QuizAttemptDTO.class)
    ))
    @APIResponse(responseCode = "404", description = "Quiz attempt not found")
    public Response getQuizAttemptById(@PathParam("attemptId") String attemptId) {
        QuizAttemptDTO attemptDTO = this.quizAttemptService.getQuizAttemptById(new ObjectId(attemptId));
        return Response.ok(attemptDTO).build();
    }

    @GET
    @Path("/byPublication/{publicationId}")
    @RolesAllowed("TEACHER")
    @Operation(summary = "Get all quiz attempts for a specific publication")
    @APIResponse(responseCode = "200", description = "List of quiz attempts", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(type = SchemaType.ARRAY, implementation = QuizAttemptDTO.class)
    ))
    public Response getQuizAttemptsByPublication(@PathParam("publicationId") String publicationId) {
        List<QuizAttemptDTO> attempts = this.quizAttemptService.getQuizAttemptsByPublication(new ObjectId(publicationId));
        return Response.ok(attempts).build();
    }

    @GET
    @Path("/publications/{publicationId}/questions/{questionId}/stats")
    @RolesAllowed("TEACHER")
    @Operation(summary = "Get statistics for a specific question in a publication")
    @APIResponse(responseCode = "200", description = "Question statistics retrieved successfully", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(type = SchemaType.ARRAY, implementation = QuizAttemptDTO.class)
    ))
    @APIResponse(responseCode = "404", description = "Publication or question not found")
    public Response getQuestionStats(
            @PathParam("publicationId") String publicationId,
            @PathParam("questionId") String questionId
    ) {
        List<QuizAttemptDTO> attempts = this.quizAttemptService.getQuizAttemptsByPublicationAndQuestion(
                new ObjectId(publicationId),
                new ObjectId(questionId)
        );
        return Response.ok(attempts).build();
    }

    @POST
    @Path("/{attemptId}/badges")
    @RolesAllowed("TEACHER")
    @Operation(summary = "Assign a badge to a quiz attempt")
    @APIResponse(
            responseCode = "200",
            description = "Badge assigned successfully"
    )
    @APIResponse(
            responseCode = "400",
            description = "Invalid input data or badge already assigned"
    )
    @APIResponse(
            responseCode = "404",
            description = "Quiz attempt not found"
    )
    public Response assignBadge(
            @PathParam("attemptId") String attemptId,
            @QueryParam("type") @Schema(implementation = BadgeType.class) BadgeType badgeType
    ) {
        this.quizAttemptService.assignBadge(
                new ObjectId(attemptId),
                badgeType,
                this.userService.getOidFromJWT()
        );

        return Response.ok().build();
    }
}