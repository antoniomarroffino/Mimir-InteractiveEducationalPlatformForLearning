package ch.supsi.controller.quizpublication;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.service.IPublicationService;
import ch.supsi.service.quizpublication.IQuizPublicationService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;

@Path("/publications")
@RolesAllowed("TEACHER")
@Produces(MediaType.APPLICATION_JSON)
public class QuizPublicationController {

    @Inject
    IQuizPublicationService quizPublicationService;


    @POST
    @Path("/{courseId}/{folderId}/{quizId}")
    @Operation(summary = "Publish a quiz")
    @APIResponse(responseCode = "201", description = "Quiz published successfully")
    @APIResponse(responseCode = "404", description = "Resource not found")
    public Response publishQuiz(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId,
            @PathParam("quizId") String quizId) {

        QuizPublication publication = this.quizPublicationService.publishQuiz(
                new ObjectId(courseId),
                new ObjectId(folderId),
                new ObjectId(quizId)
        );

        return Response.status(Response.Status.CREATED).entity(publication).build();
    }
}