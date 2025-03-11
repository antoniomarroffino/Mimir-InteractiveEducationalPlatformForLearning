package ch.supsi.controller.course;

import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.service.course.ICourseService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;
import java.util.Map;

@Path("/courses")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CourseController {

    @Inject
    ICourseService courseService;

    @GET
    @Operation(summary = "Get all courses")
    @APIResponse(
            responseCode = "200",
            description = "List of courses retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(type = SchemaType.ARRAY, implementation = CourseDTO.class)
            )
    )
    public Response getCourses() {
        try {
            List<CourseDTO> coursesDTO = this.courseService.getAllCourses();

            // Log dettagliato dei corsi
            System.out.println("Fetched Courses:");
            coursesDTO.forEach(course -> {
                System.out.println("Course ID: " + course.getId());
                System.out.println("Course Name: " + course.getName());
                System.out.println("Folders count: " + (course.getFolders() != null ? course.getFolders().size() : "null"));

                // Log dettagliato delle cartelle
                if (course.getFolders() != null) {
                    course.getFolders().forEach(folder -> {
                        System.out.println("  Folder ID: " + folder.getId());
                        System.out.println("  Folder Name: " + folder.getName());
                        System.out.println("  Quizzes count: " + (folder.getQuizzes() != null ? folder.getQuizzes().size() : "null"));

                        // Log dettagliato dei quiz
                        if (folder.getQuizzes() != null) {
                            folder.getQuizzes().forEach(quiz -> {
                                System.out.println("    Quiz ID: " + quiz.getId());
                                System.out.println("    Quiz Name: " + quiz.getName());
                                System.out.println("    Questions count: " + (quiz.getQuestions() != null ? quiz.getQuestions().size() : "null"));
                            });
                        }
                    });
                }
            });

            return Response.ok(coursesDTO).build();
        } catch (Exception e) {
            // Log dell'eccezione dettagliata
            System.err.println("Error fetching courses:");
            e.printStackTrace();

            // Restituisci un errore specifico
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of(
                            "error", "Failed to retrieve courses",
                            "details", e.getMessage()
                    ))
                    .build();
        }
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get course by ID")
    @APIResponse(
            responseCode = "200",
            description = "Course retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = CourseDTO.class)
            )
    )
    @APIResponse(
            responseCode = "404",
            description = "Course not found"
    )
    public Response getCourse(@PathParam("id") String id) {
        CourseDTO courseDTO = courseService.getCourseById(new ObjectId(id));
        return Response.ok(courseDTO).build();
    }

    @POST
    @Operation(summary = "Create a new course")
    @APIResponse(
            responseCode = "201",
            description = "Course created successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = CourseDTO.class)
            )
    )
    public Response createCourse(@Valid CourseDTO courseDTO) {
        CourseDTO createdCourseDTO = courseService.createCourse(courseDTO);
        return Response.status(Response.Status.CREATED)
                .entity(createdCourseDTO)
                .build();
    }

}