package ch.supsi.service.testContainersResource;

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.utility.DockerImageName;

import java.util.Collections;
import java.util.Map;

public class MongoTestResource implements QuarkusTestResourceLifecycleManager {

    static MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:latest"))
            .withExposedPorts(27017);

    @Override
    public Map<String, String> start() {
        mongoDBContainer.start();
        return Collections.singletonMap(
                "quarkus.mongodb.connection-string",
                "mongodb://" + mongoDBContainer.getHost() + ":" + mongoDBContainer.getFirstMappedPort()
        );
    }

    @Override
    public void stop() {
        mongoDBContainer.close();
    }
}