package ch.supsi.exception.mapper;

import ch.supsi.exception.api.ApiException;
import ch.supsi.model.dto.error.ErrorResponse;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class ApiExceptionMapperTest {
    @Inject
    ApiExceptionMapper apiExceptionMapper;

    @Test
    @DisplayName("Should return a RestResponse with an ErrorResponse as Entity")
    void test01HandleApiException_ShouldMapCorrectlyForBadRequest() {
        String errorMessage = "My test error message";
        ApiException exception = new MyTestException(errorMessage);

        RestResponse<ErrorResponse> response = this.apiExceptionMapper.handleApiException(exception);

        assertAll(
                () -> assertEquals(MyTestException.status.getStatusCode(), response.getStatus()),
                () -> assertEquals("My test error message", response.getEntity().getMessage()),
                () -> assertIterableEquals(List.of(MyTestException.status.getReasonPhrase()), response.getEntity().getDetails())
        );
    }

    static class MyTestException extends ApiException {
        private static final Response.Status status = Response.Status.NOT_IMPLEMENTED;

        public MyTestException(String message) {
            super(message, status);
        }
    }
}
