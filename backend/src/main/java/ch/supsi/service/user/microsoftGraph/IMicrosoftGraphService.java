package ch.supsi.service.user.microsoftGraph;

import com.microsoft.graph.models.User;

import java.util.List;

public interface IMicrosoftGraphService {
    User getUserByOid(String oid);

    User getUserByEmail(String email);
}
