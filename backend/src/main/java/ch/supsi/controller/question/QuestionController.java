package ch.supsi.controller.question;

import ch.supsi.mapper.QuestionMapper;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.service.question.IQuestionService;
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
import java.util.Map;

@Path("/courses/{courseId}/folders/{folderId}/quizzes/{quizId}/questions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuestionController {

    @Inject
    IQuestionService questionService;

    @GET
    @Operation(summary = "Get all questions in a quiz")
    @APIResponse(
            responseCode = "200",
            description = "List of questions retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(type = SchemaType.ARRAY, implementation = QuestionDTO.class)
            )
    )
    public Response getQuestions(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId,
            @PathParam("quizId") String quizId) {
        List<QuestionDTO> questionsDTO = questionService.getQuestionsInQuiz(
                new ObjectId(courseId),
                new ObjectId(folderId),
                new ObjectId(quizId)
        );
        return Response.ok(questionsDTO).build();
    }

    @POST
    @Path("/type")
    @Operation(summary = "Create a question template")
    @APIResponse(
            responseCode = "201",
            description = "Question template created successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = QuestionDTO.class)
            )
    )
    public Response createQuestionTemplate(
            @QueryParam("type") QuestionType type) {

        QuestionDTO questionDTO = questionService.createQuestionTemplate(type);
        return Response.status(Response.Status.CREATED)
                .entity(questionDTO)
                .build();
    }

    @POST
    @Operation(summary = "Add a question to a quiz")
    @APIResponse(
            responseCode = "201",
            description = "Question added successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = QuestionDTO.class)
            )
    )
    public Response addQuestionToQuiz(
            @PathParam("courseId") String courseId,
            @PathParam("folderId") String folderId,
            @PathParam("quizId") String quizId,
            @Valid QuestionDTO questionDTO) {

        try {
            QuestionDTO savedQuestionDTO = questionService.addQuestionToQuiz(
                    new ObjectId(courseId),
                    new ObjectId(folderId),
                    new ObjectId(quizId),
                    questionDTO
            );

            return Response.status(Response.Status.CREATED)
                    .entity(savedQuestionDTO)
                    .build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", e.getMessage()))
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("error", "Failed to add question", "details", e.getMessage()))
                    .build();
        }
    }
}