package ch.supsi.repository;

import ch.supsi.model.api.Course;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class CourseRepository implements PanacheMongoRepository<Course> {
    public List<Course> listAll() {
        return mongoCollection().find().into(new ArrayList<>());
    }
    public Optional<Course> findByNameOptional(String name) {
        return find("{'name': ?1}", name).firstResultOptional();
    }
}