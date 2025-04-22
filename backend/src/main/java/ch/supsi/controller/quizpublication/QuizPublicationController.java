package ch.supsi.controller.quizpublication;

import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.service.course.ICourseService;
import ch.supsi.service.quiz.IQuizService;
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

@Path("/publications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuizPublicationController {

    @Inject
    IQuizPublicationService quizPublicationService;

    @Inject
    IQuizService quizService;

    @Inject
    ICourseService courseService;

    @POST
    @RolesAllowed("TEACHER")
    @Operation(summary = "Publish a quiz")
    @APIResponse(responseCode = "201", description = "Quiz published successfully", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(type = SchemaType.OBJECT, implementation = QuizPublicationDTO.class)
    ))
    @APIResponse(responseCode = "400", description = "Invalid input data")
    @APIResponse(responseCode = "404", description = "Resource not found")
    public Response publishQuiz(@Valid QuizPublicationDTO quizPublicationDTO) {
        CourseDTO courseDTO = this.courseService.getCourseById(new ObjectId(quizPublicationDTO.getCourseId()));
        QuizDTO quizDTO = this.quizService.getQuizInFolder(
                courseDTO,
                new ObjectId(quizPublicationDTO.getFolderId()),
                new ObjectId(quizPublicationDTO.getQuizId())
        );
        quizPublicationDTO.setQuestions(quizDTO.getQuestions());
        QuizPublicationDTO responseDTO = this.quizPublicationService.publishQuiz(quizPublicationDTO);
        return Response.status(Response.Status.CREATED).entity(responseDTO).build();
    }

    @GET
    @RolesAllowed({"STUDENT", "TEACHER"})
    @Path("/{publicationID}")
    @Operation(summary = "Get publication by id")
    @APIResponse(responseCode = "200", description = "Publication found", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(implementation = QuizPublicationDTO.class)
    ))
    @APIResponse(responseCode = "404", description = "Publication not found")
    public Response getPublicationById(@PathParam("publicationID") String publicationID) {
        QuizPublicationDTO publicationDTO = this.quizPublicationService.getQuizPublicationById(new ObjectId(publicationID));
        return Response.ok(publicationDTO).build();
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
        QuizPublicationDTO publicationDTO = this.quizPublicationService.getPublicationByCode(code);
        return Response.ok(publicationDTO).build();
    }

    @PUT
    @RolesAllowed("TEACHER")
    @Path("/deactivate/{publicationId}")
    @Operation(summary = "deactivate a quiz publication")
    @APIResponse(responseCode = "200", description = "Quiz publication deactivate successfully", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(type = SchemaType.OBJECT, implementation = QuizPublicationDTO.class)
    ))
    @APIResponse(responseCode = "404", description = "Publication not found")
    public Response deactivateQuizPublication(@PathParam("publicationId") String publicationId) {
        QuizPublicationDTO updatedDTO = this.quizPublicationService.deactivateQuizPublication(new ObjectId(publicationId));

        return Response.ok(updatedDTO).build();
    }

    @DELETE
    @RolesAllowed("TEACHER")
    @Path("/{id}")
    @Operation(summary = "Delete a quiz publication")
    @APIResponse(responseCode = "204", description = "Quiz publication deleted successfully")
    @APIResponse(responseCode = "404", description = "Publication not found")
    public Response deleteQuizPublication(@PathParam("id") String id) {
        this.quizPublicationService.deleteQuizPublication(new ObjectId(id));

        return Response.noContent().build();
    }

    @GET
    @RolesAllowed("TEACHER")
    @Path("/byQuizId/{quizId}")
    @Operation(summary = "Get publications by quiz ID")
    @APIResponse(responseCode = "200", description = "List of publications for the quiz", content = @Content(
            mediaType = MediaType.APPLICATION_JSON,
            schema = @Schema(type = SchemaType.ARRAY, implementation = QuizPublicationDTO.class)
    ))
    public Response getPublicationsByQuizId(@PathParam("quizId") String quizId) {
        List<QuizPublicationDTO> publications = this.quizPublicationService.getPublicationsByQuizId(new ObjectId(quizId));
        return Response.ok(publications).build();
    }
}