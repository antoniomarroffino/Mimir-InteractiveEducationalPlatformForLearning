package ch.supsi.controller.course;

import ch.supsi.model.api.Course;
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
                    schema = @Schema(type = SchemaType.ARRAY, implementation = Course.class)
            )
    )
    public Response getCourses() {
        return Response.ok(this.courseService.getAllCourses()).build();
    }

    @GET
    @Path("/{id}")
    @Operation(summary = "Get course by ID")
    @APIResponse(
            responseCode = "200",
            description = "Course retrieved successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = Course.class)
            )
    )
    @APIResponse(
            responseCode = "404",
            description = "Course not found"
    )
    public Response getCourse(@PathParam("id") String id) {
        return Response.ok(this.courseService.getCourseById(new ObjectId(id))).build();
    }

    @POST
    @Operation(summary = "Create a new course")
    @APIResponse(
            responseCode = "201",
            description = "Course created successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = Course.class)
            )
    )
    public Response createCourse(@Valid Course course) {
        Course createdCourse = this.courseService.createCourse(course);
        return Response.status(Response.Status.CREATED)
                .entity(createdCourse)
                .build();
    }


    @DELETE
    @Path("/{id}")
    @Operation(summary = "Delete a course")
    @APIResponse(
            responseCode = "204",
            description = "Course deleted successfully"
    )
    @APIResponse(
            responseCode = "404",
            description = "Course not found"
    )
    public Response deleteCourse(@PathParam("id") String id) {
        this.courseService.deleteCourse(new ObjectId(id));
        return Response.noContent().build();
    }
}