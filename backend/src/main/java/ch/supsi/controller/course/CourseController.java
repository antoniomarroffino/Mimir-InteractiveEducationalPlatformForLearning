package ch.supsi.controller.course;

import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.service.course.ICourseService;
import ch.supsi.service.user.IUserService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;

import java.util.List;

@Path("/courses")
@RolesAllowed("TEACHER")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CourseController {
    @Inject
    ICourseService courseService;

    @Inject
    IUserService userService;

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
        List<CourseDTO> coursesDTO = this.courseService.getAllCourses(this.userService.getCurrentLoggedUser());
        return Response.ok(coursesDTO).build();
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
        CourseDTO courseDTO = this.courseService.getCourseById(new ObjectId(id));
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
        CourseDTO createdCourseDTO = this.courseService.createCourse(courseDTO, this.userService.getCurrentLoggedUser());
        return Response.status(Response.Status.CREATED)
                .entity(createdCourseDTO)
                .build();
    }

    @PUT
    @Path("/{id}")
    @Operation(summary = "Update an existing course")
    @APIResponse(
            responseCode = "200",
            description = "Course updated successfully",
            content = @Content(
                    mediaType = MediaType.APPLICATION_JSON,
                    schema = @Schema(implementation = CourseDTO.class)
            )
    )
    @APIResponse(
            responseCode = "404",
            description = "Course not found"
    )
    public Response updateCourse(
            @PathParam("id") String id,
            @Valid CourseDTO courseDTO
    ) {
        CourseDTO updatedCourseDTO = this.courseService.updateCourse(
                new ObjectId(id),
                courseDTO,
                this.userService.getCurrentLoggedUser()
        );

        return Response.ok(updatedCourseDTO).build();
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
        this.courseService.deleteCourse(
                new ObjectId(id),
                this.userService.getCurrentLoggedUser()
        );

        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @PUT
    @Path("/assign/{id}")
    @Operation(summary = "Assign course to logged user given courseID")
    @APIResponse(
            responseCode = "204",
            description = "Assign course to logged user given courseID"
    )
    public Response assignCourse(@PathParam("id") String id) {
        this.courseService.assignCourse(new ObjectId(id), this.userService.getCurrentLoggedUser());
        return Response.status(Response.Status.NO_CONTENT)
                .build();
    }
}