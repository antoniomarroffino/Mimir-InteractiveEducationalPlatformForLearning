package ch.supsi.controller;

import ch.supsi.model.Milestone;
import ch.supsi.service.IMilestoneService;
import ch.supsi.service.MilestoneService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/milestones")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MilestoneController {

    @Inject
    IMilestoneService milestoneService;

    @GET
    public Response getMilestones() {
        try {
            List<Milestone> milestones = this.milestoneService.getAllMilestones();
            return Response.ok(milestones).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Errore nel recupero delle milestone: " + e.getMessage())
                    .build();
        }
    }

    @POST
    public Response createMilestone(Milestone milestone) {
        try {
            if (milestone == null || milestone.getName() == null || milestone.getName().trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Il nome della milestone non può essere vuoto")
                        .build();
            }
            Milestone createdMilestone = this.milestoneService.createMilestone(milestone);
            return Response.status(Response.Status.CREATED)
                    .entity(createdMilestone)
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Errore nella creazione della milestone: " + e.getMessage())
                    .build();
        }
    }
}