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
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;

import java.util.List;
import java.util.stream.Collectors;

@Path("/publications")
@RolesAllowed("TEACHER")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuizPublicationController {

    @Inject
    IQuizPublicationService quizPublicationService;

    @Inject
    QuizPublicationMapper quizPublicationMapper;


    @POST
    @Operation(summary = "Publish a quiz")
    @APIResponse(responseCode = "201", description = "Quiz published successfully", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(type = SchemaType.OBJECT, implementation = QuizPublicationDTO.class)
    ))
    @APIResponse(responseCode = "400", description = "Invalid input data")
    @APIResponse(responseCode = "404", description = "Resource not found")
    public Response publishQuiz(@Valid QuizPublicationDTO quizPublicationDTO) {
        QuizPublicationDTO responseDTO = quizPublicationService.publishQuiz(quizPublicationDTO);
        return Response.status(Response.Status.CREATED).entity(responseDTO).build();
    }

    @GET
    @Path("/byReferences/{courseId}/{folderId}/{quizId}")
    @Operation(summary = "Get publication by references")
    @APIResponse(responseCode = "200", description = "Publication found", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(implementation = QuizPublicationDTO.class)
    ))
    @APIResponse(responseCode = "404", description = "Publication not found")
    public Response getPublicationByReferences(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId,
            @PathParam("quizId") String quizId) {

        QuizPublication publication = quizPublicationService.getPublicationByReferences(
                new ObjectId(courseId),
                new ObjectId(folderId),
                new ObjectId(quizId)
        );

        if (publication == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(quizPublicationMapper.toDTO(publication)).build();
    }

    @GET
    @Operation(summary = "Get all publications")
    @APIResponse(responseCode = "200", description = "List of all publications", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(type = SchemaType.ARRAY, implementation = QuizPublicationDTO.class)
    ))
    public Response getAllPublications() {
        List<QuizPublication> publications = quizPublicationService.getAllPublications();
        List<QuizPublicationDTO> dtos = publications.stream()
                .map(quizPublicationMapper::toDTO)
                .collect(Collectors.toList());
        return Response.ok(dtos).build();
    }


    @GET
    @Path("/byCode/{code}")
    @Operation(summary = "Get publication by access code")
    @APIResponse(responseCode = "200", description = "Publication found", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(implementation = QuizPublicationDTO.class)
    ))
    @APIResponse(responseCode = "404", description = "Publication not found")
    public Response getPublicationByCode(@PathParam("code") String code) {
        QuizPublication publication = this.quizPublicationService.getPublicationByCode(code);

        if (publication == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(this.quizPublicationMapper.toDTO(publication)).build();
    }

}