package ch.supsi.model.dto.error;

import io.quarkus.runtime.annotations.RegisterForReflection;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
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

    public String getMessage() {
        return this.message;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public List<String> getDetails() {
        return this.details;
    }
}
