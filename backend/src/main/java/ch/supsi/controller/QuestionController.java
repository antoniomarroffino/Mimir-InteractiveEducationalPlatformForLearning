package ch.supsi.controller;

import ch.supsi.model.Question;
import ch.supsi.service.QuestionService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/questions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuestionController {

    @Inject
    QuestionService questionService;
    @GET
    public Response getQuestions() {
        try {
            List<Question> questions = questionService.getAllQuestions();
            return Response.ok(questions).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Errore nel recupero delle domande: " + e.getMessage())
                    .build();
        }
    }

    @POST
    public Response createQuestion(Question question) {
        try {
            if (question == null ){
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("La domanda è null")
                        .build();
            }
            Question createdQuestion = questionService.createQuestion(question);
            return Response.status(Response.Status.CREATED)
                    .entity(createdQuestion)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Errore nella creazione della domanda: " + e.getMessage())
                    .build();
        }
    }
}
