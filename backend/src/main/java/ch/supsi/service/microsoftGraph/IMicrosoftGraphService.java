package ch.supsi.service.microsoftGraph;

public interface IMicrosoftGraphService {
    void getUserByOid(String oid);
    void getUserByEmail(String email);
}
