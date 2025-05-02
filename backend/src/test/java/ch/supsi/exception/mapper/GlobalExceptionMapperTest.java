package ch.supsi.exception.mapper;

import ch.supsi.model.dto.error.ErrorResponse;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
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
public class GlobalExceptionMapperTest {
    @Inject
    GlobalExceptionMapper globalExceptionMapper;

    @Test
    @DisplayName("Should return a RestResponse with an ErrorResponse as Entity")
    void test01HandleGenericException_ShouldMapCorrectlyForGenericException() {
        UnsupportedOperationException unsupportedException = new UnsupportedOperationException("Unsupported operation");

        RestResponse<ErrorResponse> response = this.globalExceptionMapper.handleGenericException(unsupportedException);

        assertAll(
                () -> assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus()),
                () -> assertEquals("Unsupported operation", response.getEntity().getMessage()),
                () -> assertIterableEquals(List.of(Arrays.toString(unsupportedException.getStackTrace())), response.getEntity().getDetails())
        );
    }
}
