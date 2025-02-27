package ch.supsi.exception.mapper;

import ch.supsi.model.dto.error.ErrorResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import java.util.List;

@ApplicationScoped
public class ValidationExceptionMapper {
    @ServerExceptionMapper(value = ConstraintViolationException.class)
    public RestResponse<ErrorResponse> handleValidationException(ConstraintViolationException ex) {
        List<String> errors = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .toList();

        ErrorResponse error = new ErrorResponse("Validation failed", errors);
        return RestResponse.status(Response.Status.BAD_REQUEST, error);
    }
}