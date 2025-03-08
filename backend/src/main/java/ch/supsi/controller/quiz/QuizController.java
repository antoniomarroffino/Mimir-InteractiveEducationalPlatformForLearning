package ch.supsi.controller.quiz;

import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.service.quiz.IQuizService;
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

@Path("/courses/{courseId}/folders/{folderId}/quizzes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuizController {

    @Inject
    IQuizService quizService;

    @GET
    @Operation(summary = "Get all quizzes in a folder")
    @APIResponse(
            responseCode = "200",
            description = "List of quizzes retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(type = SchemaType.ARRAY, implementation = QuizDTO.class)
            )
    )
    public Response getQuizzes(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId) {
        List<QuizDTO> quizzesDTO = quizService.getQuizzesInFolder(
                new ObjectId(courseId),
                new ObjectId(folderId)
        );
        return Response.ok(quizzesDTO).build();
    }

    @GET
    @Path("/{quizId}")
    @Operation(summary = "Get specific quiz in a folder")
    @APIResponse(
            responseCode = "200",
            description = "Quiz retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = QuizDTO.class)
            )
    )
    public Response getQuiz(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId,
            @PathParam("quizId") String quizId) {
        QuizDTO quizDTO = quizService.getQuizInFolder(
                new ObjectId(courseId),
                new ObjectId(folderId),
                new ObjectId(quizId)
        );
        return Response.ok(quizDTO).build();
    }

    @POST
    @Operation(summary = "Create quiz in folder")
    @APIResponse(
            responseCode = "201",
            description = "Quiz created successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = QuizDTO.class)
            )
    )
    public Response createQuiz(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId,
            @Valid QuizDTO quizDTO) {
        QuizDTO createdQuizDTO = quizService.addQuizToFolder(
                new ObjectId(courseId),
                new ObjectId(folderId),
                quizDTO
        );
        return Response.status(Response.Status.CREATED)
                .entity(createdQuizDTO)
                .build();
    }

    @PUT
    @Path("/{quizId}")
    @Operation(summary = "Update quiz in folder")
    @APIResponse(
            responseCode = "200",
            description = "Quiz updated successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = QuizDTO.class)
            )
    )
    public Response updateQuiz(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId,
            @PathParam("quizId") String quizId,
            @Valid QuizDTO quizDTO) {
        QuizDTO updatedQuizDTO = quizService.updateQuizInFolder(
                new ObjectId(courseId),
                new ObjectId(folderId),
                new ObjectId(quizId),
                quizDTO
        );
        return Response.ok(updatedQuizDTO).build();
    }

    @DELETE
    @Path("/{quizId}")
    @Operation(summary = "Delete quiz from folder")
    @APIResponse(
            responseCode = "204",
            description = "Quiz deleted successfully"
    )
    public Response deleteQuiz(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId,
            @PathParam("quizId") String quizId) {
        quizService.removeQuizFromFolder(
                new ObjectId(courseId),
                new ObjectId(folderId),
                new ObjectId(quizId)
        );
        return Response.noContent().build();
    }
}