package ch.supsi.exception.mapper;

import ch.supsi.model.dto.error.ErrorResponse;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class WebExceptionMapperTest {
    @Inject
    WebExceptionMapper webExceptionMapper;

    @Test
    @DisplayName("Should map standard WebApplicationException correctly")
    void test01HandleWebException_ShouldMapStandardException() {
        WebApplicationException ex = new WebApplicationException(
                "Test error message",
                Response.Status.BAD_REQUEST
        );

        RestResponse<ErrorResponse> response = this.webExceptionMapper.handleWebException(ex);

        assertAll(
                () -> assertEquals(ex.getResponse().getStatusInfo().getStatusCode(), response.getStatus()),
                () -> assertEquals(ex.getMessage(), response.getEntity().getMessage()),
                () -> assertIterableEquals(List.of(Arrays.toString(ex.getStackTrace())), response.getEntity().getDetails())
        );
    }

    @Test
    @DisplayName("Should handle exceptions without explicit status")
    void test02HandleWebException_ShouldHandleDefaultStatus() {
        WebApplicationException ex = new WebApplicationException("Internal error");

        RestResponse<ErrorResponse> response = this.webExceptionMapper.handleWebException(ex);

        assertAll(
                () -> assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus()),
                () -> assertEquals(ex.getMessage(), response.getEntity().getMessage())
        );
    }

    @Test
    @DisplayName("Should handle empty message gracefully")
    void test03HandleWebException_ShouldHandleEmptyMessage() {
        WebApplicationException ex = new WebApplicationException(
                "",
                Response.Status.NOT_FOUND
        );

        RestResponse<ErrorResponse> response = this.webExceptionMapper.handleWebException(ex);

        assertAll(
                () -> assertEquals(ex.getResponse().getStatusInfo().getStatusCode(), response.getStatus()),
                () -> assertEquals(ex.getMessage(), response.getEntity().getMessage())
        );
    }
}
