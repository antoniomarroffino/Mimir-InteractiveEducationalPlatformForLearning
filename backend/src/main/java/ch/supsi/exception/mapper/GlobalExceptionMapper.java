package ch.supsi.exception.mapper;

import ch.supsi.model.dto.error.ErrorResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import java.util.List;

@ApplicationScoped
public class GlobalExceptionMapper {
    @ServerExceptionMapper
    public RestResponse<ErrorResponse> handleGenericException(Exception exception) {
        ErrorResponse error = new ErrorResponse(
                "Internal server error",
                List.of("Unexpected error occurred", exception.getMessage())
        );
        return RestResponse.status(Response.Status.INTERNAL_SERVER_ERROR, error);
    }
}

