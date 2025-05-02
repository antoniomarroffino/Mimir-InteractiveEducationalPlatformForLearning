package ch.supsi.model.api.user;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class UserTest {
    @Test
    @DisplayName("Should create a default STUDENT user with constructor no parameters")
    void test01CreateDefaultStudentUser_ConstructorWithNoParameters() {
        User user = new User();
        assertEquals(Role.STUDENT, user.role);
        assertNotNull(user.coursesId);
        assertTrue(user.coursesId.isEmpty());
        assertNull(user.azureOid);
    }
}
