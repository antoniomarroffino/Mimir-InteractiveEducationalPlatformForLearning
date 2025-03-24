package ch.supsi.repository;

import ch.supsi.model.api.Course;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class CourseRepository implements PanacheMongoRepository<Course> {
    public List<Course> listAll() {
        return mongoCollection().find().into(new ArrayList<>());
    }
    public List<Course> findAllCourses() {
        return list("{}");
    }
}