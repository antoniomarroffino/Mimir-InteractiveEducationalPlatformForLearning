package ch.supsi.repository.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.repository.UserRepository;
import ch.supsi.service.user.UserServiceTest;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
public class UserRepositoryTest {
    @Inject
    UserRepository userRepository;

    @BeforeEach
    public void cleanup() {
        this.userRepository.deleteAll();
    }

    @Test
    @DisplayName("Test 01: Should return Optional of user found by azureOid")
    public void test01FindByAzureOidOptional_Found() {
        String azureOid = "oid-123";
        User user = UserServiceTest.createTestUser(azureOid, Role.STUDENT);
        this.userRepository.persist(user);

        Optional<User> found = this.userRepository.findByAzureOidOptional(azureOid);

        assertTrue(found.isPresent());
        assertEquals(azureOid, found.get().azureOid);
    }

    @Test
    @DisplayName("Should return Empty Optional when user not found by azureOid")
    public void test02FindByAzureOidOptional_NotFound() {
        Optional<User> found = this.userRepository.findByAzureOidOptional("non-existent-oid");

        assertFalse(found.isPresent());
    }

    @Test
    @DisplayName("Should return teacher users")
    public void test03FindTeacherUsers() {
        User teacher1 = UserServiceTest.createTestUser("teacher-1", Role.TEACHER);
        User teacher2 = UserServiceTest.createTestUser("teacher-2", Role.TEACHER);
        User student = UserServiceTest.createTestUser("student-1", Role.STUDENT);

        this.userRepository.persist(teacher1);
        this.userRepository.persist(teacher2);
        this.userRepository.persist(student);

        List<User> teacherUsers = this.userRepository.findTeacherUsers();

        assertNotNull(teacherUsers);
        assertEquals(2, teacherUsers.size());
        teacherUsers.forEach(u -> assertEquals(Role.TEACHER, u.role));
    }

    @Test
    @DisplayName("Should return admin users")
    public void test04FindAdminUsers() {
        User admin1 = UserServiceTest.createTestUser("admin-1", Role.ADMIN);
        User admin2 = UserServiceTest.createTestUser("admin-2", Role.ADMIN);
        User teacher = UserServiceTest.createTestUser("teacher-3", Role.TEACHER);

        this.userRepository.persist(admin1);
        this.userRepository.persist(admin2);
        this.userRepository.persist(teacher);

        List<User> adminUsers = this.userRepository.findAdminUsers();

        assertNotNull(adminUsers);
        assertEquals(2, adminUsers.size());
        adminUsers.forEach(u -> assertEquals(Role.ADMIN, u.role));
    }

    @Test
    @DisplayName("Should add course to user")
    public void test05AddCourseToUser() {
        String azureOid = "oid-add-course";
        User user = UserServiceTest.createTestUser(azureOid, Role.STUDENT);
        this.userRepository.persist(user);

        String courseId = "course-101";
        this.userRepository.addCourseToUser(courseId, azureOid);

        Optional<User> found = this.userRepository.findByAzureOidOptional(azureOid);
        assertTrue(found.isPresent());
        User updatedUser = found.get();
        assertTrue(updatedUser.coursesId.contains(courseId));
    }

    @Test
    @DisplayName("Should remove course from user")
    public void test06RemoveCourseFromUser() {
        String azureOid = "oid-remove-course";
        User user = UserServiceTest.createTestUser(azureOid, Role.STUDENT);
        user.coursesId.add("course-202");
        this.userRepository.persist(user);

        this.userRepository.removeCourseFromUser("course-202", azureOid);

        Optional<User> found = this.userRepository.findByAzureOidOptional(azureOid);
        assertTrue(found.isPresent());
        User updatedUser = found.get();
        assertFalse(updatedUser.coursesId.contains("course-202"));
    }

    @Test
    @DisplayName("Should delete user by azureOid")
    public void test07DeleteByAzureOid() {
        String azureOid = "oid-delete";
        User user = UserServiceTest.createTestUser(azureOid, Role.STUDENT);
        this.userRepository.persist(user);

        this.userRepository.deleteByAzureOid(azureOid);

        Optional<User> found = this.userRepository.findByAzureOidOptional(azureOid);
        assertFalse(found.isPresent());
    }
}
