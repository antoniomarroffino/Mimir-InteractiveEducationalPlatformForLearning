package ch.supsi.model.dto.error;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class ErrorResponseTest {
    @Test
    @DisplayName("Should create new ErrorResponse passing message to constructor")
    void test01CreateErrorResponse_PassingMessageToConstructor() {
        String message = "This is a test message";
        ErrorResponse errorResponse = new ErrorResponse(message);
        assertEquals(message, errorResponse.getMessage());
        assertNotNull(errorResponse.getDetails());
        assertTrue(errorResponse.getDetails().isEmpty());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    @DisplayName("Should create new ErrorResponse passing message and details to constructor")
    void test02CreateErrorResponse_PassingMessageAndDetailsToConstructor() {
        String message = "This is a test message";
        String details1 = "This is a details 1";
        String details2 = "This is a details 2";
        String details3 = "This is a details 3";
        List<String> details = Arrays.asList(details1, details2, details3);
        ErrorResponse errorResponse = new ErrorResponse(message, details);
        assertEquals(message, errorResponse.getMessage());
        assertNotNull(errorResponse.getDetails());
        assertEquals(details.size(), errorResponse.getDetails().size());
        assertEquals(details1, errorResponse.getDetails().getFirst());
        assertEquals(details2, errorResponse.getDetails().get(1));
        assertEquals(details3, errorResponse.getDetails().get(2));
        assertNotNull(errorResponse.getTimestamp());
    }
}
