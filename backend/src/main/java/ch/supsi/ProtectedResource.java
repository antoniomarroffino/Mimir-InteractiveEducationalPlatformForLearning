package ch.supsi;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/secure")
@Authenticated
public class ProtectedResource {

    @Path("/message")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String protectedEndpoint() {
        return "This is a protected message from backend!";
    }
}
