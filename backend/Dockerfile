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

RUN curl -sS "https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem" > /app/global-bundle.pem

COPY --from=builder /app/target/*-runner serviceQuarkus
ENV QUARKUS_PROFILE=prod
# Imposta le variabili di ambiente per SSL
ENV JAVA_OPTS="-Djavax.net.ssl.trustStore=/app/global-bundle.pem -Djavax.net.ssl.trustStoreType=PEM"

RUN chmod 775 /app /app/serviceQuarkus \
  && chown -R 1001 /app \
  && chmod -R "g+rwX" /app \
  && chown -R 1001:root /app \
  && chmod 644 /app/global-bundle.pem

EXPOSE 8080
USER 1001

ENTRYPOINT ["./serviceQuarkus"]