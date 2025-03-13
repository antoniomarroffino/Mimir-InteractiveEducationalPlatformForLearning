package ch.supsi.exception.mapper;

import ch.supsi.model.dto.error.ErrorResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.WebApplicationException;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

@ApplicationScoped
public class WebExceptionMapper {
    @ServerExceptionMapper(WebApplicationException.class)
    public RestResponse<ErrorResponse> handleWebException(WebApplicationException exception) {
        ErrorResponse error = new ErrorResponse(
                exception.getMessage()
        );

        return RestResponse.status(exception.getResponse().getStatusInfo().toEnum(), error);
    }
}
