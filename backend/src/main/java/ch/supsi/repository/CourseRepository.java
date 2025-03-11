package ch.supsi.repository;

import ch.supsi.model.api.Course;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class CourseRepository implements PanacheMongoRepository<Course> {
    // Implementa esplicitamente il metodo listAll
    public List<Course> listAll() {
        return mongoCollection().find().into(new ArrayList<>());
    }

    // Oppure, se preferisci usare la query di Panache
    public List<Course> findAllCourses() {
        return list("{}");
    }
}