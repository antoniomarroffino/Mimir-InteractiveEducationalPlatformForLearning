# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -T 1C package -DskipTests -Dquarkus.package.type=uber-jar

# Stage 2: Run the application
FROM amazoncorretto:21 AS runner
WORKDIR /app
COPY --from=builder /app/target/*-runner.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dquarkus.profile=prod", "-jar", "app.jar"]