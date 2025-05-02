package ch.supsi.model.dto.api.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class UserWithoutCoursesDTOTest {
    @Test
    @DisplayName("Should create UserWithoutCoursesDTO with constructor no parameters")
    void test01CreateUserWithoutCoursesDTO_ConstructorWithNoParameters() {
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        assertNull(userWithoutCoursesDTO.getAzureOid());
        assertNull(userWithoutCoursesDTO.getName());
        assertNull(userWithoutCoursesDTO.getEmail());
        assertNull(userWithoutCoursesDTO.getRole());
    }

    @Test
    @DisplayName("Should set al fields correctly")
    void test02SetAlFieldsCorrectly() {
        String azureOID = "TEST-OID";
        String name = "TEST-NAME";
        String email = "TEST-EMAIL";

        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(azureOID);
        userWithoutCoursesDTO.setName(name);
        userWithoutCoursesDTO.setEmail(email);
        userWithoutCoursesDTO.setRole(Role.TEACHER);

        assertEquals(azureOID, userWithoutCoursesDTO.getAzureOid());
        assertEquals(name, userWithoutCoursesDTO.getName());
        assertEquals(email, userWithoutCoursesDTO.getEmail());
        assertEquals(Role.TEACHER, userWithoutCoursesDTO.getRole());
    }
}
