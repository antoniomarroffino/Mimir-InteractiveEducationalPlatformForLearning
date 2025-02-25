package ch.supsi.service;

import ch.supsi.model.Milestone;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class MilestoneService implements IMilestoneService {

    @Override
    public List<Milestone> getAllMilestones() {
        return Milestone.listAll();
    }

    @Override
    public Milestone createMilestone(Milestone milestone) {
        milestone.persist();
        return milestone;
    }
}