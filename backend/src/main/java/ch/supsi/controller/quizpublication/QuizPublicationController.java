package ch.supsi.controller.quizpublication;

import ch.supsi.mapper.QuizPublicationMapper;
import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.service.quizpublication.IQuizPublicationService;
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

@Path("/publications")
@RolesAllowed("TEACHER")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuizPublicationController {

    @Inject
    IQuizPublicationService quizPublicationService;


    @POST
    @Operation(summary = "Publish a quiz")
    @APIResponse(responseCode = "201", description = "Quiz published successfully", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(type = SchemaType.OBJECT, implementation = QuizPublicationDTO.class)
    ))
    @APIResponse(responseCode = "400", description = "Invalid input data")
    @APIResponse(responseCode = "404", description = "Resource not found")
    public Response publishQuiz(@Valid QuizPublicationDTO quizPublicationDTO) {
        QuizPublication createdPublication = quizPublicationService.publishQuiz(quizPublicationDTO);
        QuizPublicationDTO responseDto = quizPublicationMapper.toDTO(createdPublication);
        return Response.status(Response.Status.CREATED).entity(responseDto).build();
    }
}