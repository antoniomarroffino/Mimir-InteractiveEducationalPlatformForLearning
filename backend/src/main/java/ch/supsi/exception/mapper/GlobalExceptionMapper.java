package ch.supsi.exception.mapper;

import ch.supsi.model.dto.error.ErrorResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.jetbrains.annotations.NotNull;

import java.util.Arrays;
import java.util.List;

@ApplicationScoped
public class GlobalExceptionMapper {
    @ServerExceptionMapper
    public RestResponse<ErrorResponse> handleGenericException(@NotNull Exception exception) {
        ErrorResponse error = new ErrorResponse(
                exception.getMessage(),
                List.of(Arrays.toString(exception.getStackTrace()))
        );
        return RestResponse.status(Response.Status.INTERNAL_SERVER_ERROR, error);
    }
}

