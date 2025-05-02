package ch.supsi.exception.mapper;

import ch.supsi.exception.api.ApiException;
import ch.supsi.model.dto.error.ErrorResponse;
import jakarta.enterprise.context.ApplicationScoped;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;
import org.jetbrains.annotations.NotNull;

import java.util.List;

@ApplicationScoped
public class ApiExceptionMapper {
    @ServerExceptionMapper(value = ApiException.class)
    public RestResponse<ErrorResponse> handleApiException(@NotNull ApiException exception) {
        ErrorResponse error = new ErrorResponse(
                exception.getMessage(),
                List.of(exception.getStatus().getReasonPhrase())
        );

        return RestResponse.status(exception.getStatus(), error);
    }
}
