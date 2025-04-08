package ch.supsi.exception.mapper;

import ch.supsi.model.dto.error.ErrorResponse;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class ValidationExceptionMapperTest {
    @Inject
    ValidationExceptionMapper validationExceptionMapper;

    @Test
    @DisplayName("Should map ConstraintViolationException to proper error response")
    void test01HandleValidationException_ShouldMapCorrectly() {
        ConstraintViolation<?> violation = Mockito.mock(ConstraintViolation.class);
        Path path = Mockito.mock(Path.class);

        when(violation.getPropertyPath()).thenReturn(path);
        when(path.toString()).thenReturn("email");
        when(violation.getMessage()).thenReturn("must be a valid email address");

        ConstraintViolationException exception = new ConstraintViolationException(
                "Validation failed",
                Set.of(violation)
        );

        RestResponse<ErrorResponse> response = this.validationExceptionMapper.handleValidationException(exception);

        assertAll(
                () -> assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus()),
                () -> assertEquals("Validation failed", response.getEntity().getMessage()),
                () -> assertEquals(List.of("email: must be a valid email address"), response.getEntity().getDetails())
        );
    }

    @Test
    @DisplayName("Should handle empty violations list gracefully")
    void test02HandleValidationException_ShouldHandleEmptyViolations() {
        ConstraintViolationException exception = new ConstraintViolationException(
                "Validation failed",
                Collections.emptySet()
        );

        RestResponse<ErrorResponse> response = this.validationExceptionMapper.handleValidationException(exception);

        assertAll(
                () -> assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus()),
                () -> assertEquals("Validation failed", response.getEntity().getMessage()),
                () -> assertTrue(response.getEntity().getDetails().isEmpty())
        );
    }
}
