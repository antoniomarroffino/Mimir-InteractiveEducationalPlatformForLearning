package ch.supsi;

import ch.supsi.model.Question;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/questions")
public class QuestionResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Question> getQuestions() {
        return Question.listAll();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addQuestion(Question question) {
        Question.persist(question);
    }
}
