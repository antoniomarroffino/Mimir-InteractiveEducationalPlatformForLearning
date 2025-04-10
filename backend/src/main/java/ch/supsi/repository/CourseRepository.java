package ch.supsi.repository;

import ch.supsi.model.api.Course;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class CourseRepository implements PanacheMongoRepository<Course> {
    public Optional<Course> findByNameOptional(String name) {
        return find("{'name': ?1}", name).firstResultOptional();
    }
}