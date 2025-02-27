package ch.supsi.model.dto.error;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ErrorResponse {
    private final String message;
    private final List<String> details;
    private final Instant timestamp;

    public ErrorResponse(String message) {
        this.message = message;
        this.details = new ArrayList<>();
        this.timestamp = Instant.now();
    }

    public ErrorResponse(String message, List<String> details) {
        this.message = message;
        this.details = details;
        this.timestamp = Instant.now();
    }
}
