package ch.supsi.JWTProducer;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class JwtProducer {
    public static final String DEFAULT_OID = "testUser";
    public static final String DEFAULT_NAME = "Test User";
    public static final String DEFAULT_PREFERRED_USERNAME = "testUser@testforprojectsupsi.onmicrosoft.com";

    public static final String OID_CLAIM_KEY = "oid";
    public static final String NAME_CLAIM_KEY = "name";
    public static final String EMAIL_CLAIM_KEY = "preferred_username";
/*
    @ConfigProperty(name = "quarkus.oidc.token.issuer")
    String issuer;

    @Produces
    @ApplicationScoped
    public String getAccessBearerTokenJWT() {
        return Jwt.issuer(this.issuer)
                .subject(DEFAULT_OID)
                .upn(DEFAULT_NAME)
                .preferredUserName(DEFAULT_PREFERRED_USERNAME)
                .claim(OID_CLAIM_KEY, DEFAULT_OID)
                .claim(NAME_CLAIM_KEY, DEFAULT_NAME)
                .claim(EMAIL_CLAIM_KEY, DEFAULT_PREFERRED_USERNAME)
                .sign();
    }*/
}
