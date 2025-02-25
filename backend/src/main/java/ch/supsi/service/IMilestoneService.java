package ch.supsi.service;

import ch.supsi.model.Milestone;

import java.util.List;

public interface IMilestoneService {
    List<Milestone> getAllMilestones();
    Milestone createMilestone(Milestone milestone);
}
