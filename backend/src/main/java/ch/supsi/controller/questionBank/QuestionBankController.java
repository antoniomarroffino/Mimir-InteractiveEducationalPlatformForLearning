package ch.supsi.controller.questionBank;

import ch.supsi.model.dto.api.QuestionBankDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.service.question.IQuestionService;
import ch.supsi.service.questionBank.IQuestionBankService;
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

@Path("/question_banks")
@RolesAllowed("TEACHER")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuestionBankController {
    @Inject
    IQuestionBankService questionBankService;

    @Inject
    IQuestionService questionService;

    @GET
    @Operation(summary = "Get all question banks")
    @APIResponse(
            responseCode = "200",
            description = "List of question banks retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(type = SchemaType.ARRAY, implementation = QuestionBankDTO.class)
            )
    )
    public Response getQuestionBanks() {
        List<QuestionBankDTO> questionBanksDTOS = this.questionBankService.getAllQuestionBanks();
        return Response.ok(questionBanksDTOS).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get question bank by ID")
    @APIResponse(
            responseCode = "200",
            description = "Question bank retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = QuestionBankDTO.class)
            )
    )
    @APIResponse(
            responseCode = "404",
            description = "Question bank not found"
    )
    public Response getQuestionBank(@PathParam("id") String id) {
        QuestionBankDTO questionBankDTO = this.questionBankService.getQuestionBankById(new ObjectId(id));
        return Response.ok(questionBankDTO).build();
    }

    @POST
    @Operation(summary = "Create a new question bank")
    @APIResponse(
            responseCode = "201",
            description = "Question bank created successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = QuestionBankDTO.class)
            )
    )
    @APIResponse(
            responseCode = "400",
            description = "Bad Request: Invalid question bank data or duplicate name"
    )
    public Response createQuestionBank(@Valid QuestionBankDTO questionBankDTO) {
        QuestionBankDTO createdQuestionBankDTO = this.questionBankService.createQuestionBank(questionBankDTO);
        return Response.status(Response.Status.CREATED)
                .entity(createdQuestionBankDTO)
                .build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update an existing question bank")
    @APIResponse(
            responseCode = "200",
            description = "Question bank updated successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = QuestionBankDTO.class)
            )
    )
    @APIResponse(
            responseCode = "404",
            description = "Question bank not found"
    )
    @APIResponse(
            responseCode = "400",
            description = "Bad Request: Invalid question bank data or duplicate name"
    )
    public Response updateQuestionBank(
            @PathParam("id") String id,
            @Valid QuestionBankDTO questionBankDTO
    ) {
        QuestionBankDTO updatedQuestionBankDTO = this.questionBankService.updateQuestionBank(
                new ObjectId(id),
                questionBankDTO
        );

        return Response.ok(updatedQuestionBankDTO).build();
    }

    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete a question bank")
    @APIResponse(
            responseCode = "204",
            description = "Question bank deleted successfully"
    )
    @APIResponse(
            responseCode = "404",
            description = "Question bank not found"
    )
    public Response deleteQuestionBank(@PathParam("id") String id) {
        this.questionBankService.getQuestionBankById(new ObjectId(id))
                .getQuestions()
                .stream()
                .map(QuestionDTO::getId)
                .map(ObjectId::new)
                .forEach(this.questionService::deleteQuestion);
        this.questionBankService.deleteQuestionBank(new ObjectId(id));
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @PATCH
    @Path("/{id}/reorder")
    @Operation(summary = "Update question order in a question bank")
    @APIResponse(
            responseCode = "200",
            description = "Question order updated successfully"
    )
    @APIResponse(
            responseCode = "404",
            description = "Question bank not found"
    )
    @APIResponse(
            responseCode = "400",
            description = "Invalid payload"
    )
    public Response reorderQuestions(
            @PathParam("id") String id,
            List<String> orderedQuestionIds
    ) {
        questionBankService.updateQuestionOrder(new ObjectId(id), orderedQuestionIds);
        return Response.ok().build();
    }

}
