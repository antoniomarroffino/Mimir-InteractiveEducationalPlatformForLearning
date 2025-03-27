package ch.supsi.controller.quizattempt;

import ch.supsi.mapper.QuizAttemptMapper;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.service.quizattempt.IQuizAttemptService;
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
@RolesAllowed({"TEACHER", "STUDENT"})
public class QuizAttemptController {

    @Inject
    IQuizAttemptService quizAttemptService;

    @Inject
    QuizAttemptMapper quizAttemptMapper;

    @POST
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
}