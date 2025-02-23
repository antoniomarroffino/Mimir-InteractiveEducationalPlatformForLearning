package ch.supsi;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/test-db")
public class DatabaseTestResource {

    @Inject
    MongoClient mongoClient;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response testConnection() {
        try {
            MongoDatabase database = mongoClient.getDatabase("mongodb");
            MongoCollection<Document> collection = database.getCollection("Questions");
            long count = collection.countDocuments();
            return Response.ok("Connessione riuscita! Numero di documenti nella collezione: " + count).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Errore nella connessione al database: " + e.getMessage())
                    .build();
        }
    }
}
