package ch.supsi.resource;

import ch.supsi.model.Milestone;
import io.quarkus.mongodb.panache.PanacheMongoEntityBase;
import jakarta.ws.rs.*;

import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/milestones")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MilestoneResource {

    // Ottieni tutte le milestones
    @GET
    public List<Milestone> getMilestones() {
        return Milestone.listAll(); // PanacheMongoEntityBase consente di usare listAll() direttamente
    }

    // Crea una nuova milestone
    @POST
    public void createMilestone(Milestone milestone) {
        milestone.persist(); // PanacheMongoEntityBase consente di usare persist() direttamente
    }

    // Opzionale: elimina una milestone
    @DELETE
    @Path("/{id}")
    public void deleteMilestone(@PathParam("id") String id) {
        Milestone milestone = Milestone.findById(id);
        if (milestone != null) {
            milestone.delete();
        }
    }
}
