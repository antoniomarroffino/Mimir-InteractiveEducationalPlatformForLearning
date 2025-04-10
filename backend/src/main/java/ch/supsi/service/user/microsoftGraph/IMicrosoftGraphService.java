package ch.supsi.service.user.microsoftGraph;

import com.microsoft.graph.models.User;

public interface IMicrosoftGraphService {
    User getUserByOid(String oid);

    User getUserByEmail(String email);
}
