# Stage 1: Build the native executable
FROM quay.io/quarkus/ubi-quarkus-mandrel-builder-image:jdk-21 AS builder
USER quarkus
WORKDIR /app
COPY --chown=quarkus:quarkus --chmod=0755 mvnw ./mvnw
COPY --chown=quarkus:quarkus .mvn ./.mvn
COPY --chown=quarkus:quarkus pom.xml .
COPY src ./src

RUN ./mvnw clean package \
    -Pnative \
    -DskipTests \
    -Dquarkus.native.additional-build-args="--initialize-at-run-time=com.microsoft.aad.msal4jextensions.persistence.linux.ISecurityLibrary"


# Stage 2: Create minimal runtime image
FROM quay.io/quarkus/quarkus-micro-image:2.0
WORKDIR /app
COPY --from=builder /app/target/*-runner serviceQuarkus
ENV QUARKUS_PROFILE=prod

RUN chmod 775 /app /app/serviceQuarkus \
  && chown -R 1001 /app \
  && chmod -R "g+rwX" /app \
  && chown -R 1001:root /app

EXPOSE 8080
USER 1001

ENTRYPOINT ["./serviceQuarkus"]