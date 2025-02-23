package ch.supsi.service;

import ch.supsi.model.Milestone;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class MilestoneService {

    public List<Milestone> getAllMilestones() {
        try {
            return Milestone.listAll();
        } catch (Exception e) {
            e.printStackTrace(); // Per debug
            throw new RuntimeException("Errore nel recupero delle milestone", e);
        }
    }

    public Milestone createMilestone(Milestone milestone) {
        try {
            milestone.persist();
            return milestone;
        } catch (Exception e) {
            e.printStackTrace(); // Per debug
            throw new RuntimeException("Errore nella creazione della milestone", e);
        }
    }
}