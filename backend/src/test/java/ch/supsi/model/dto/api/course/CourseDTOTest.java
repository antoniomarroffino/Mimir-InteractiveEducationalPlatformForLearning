package ch.supsi.model.dto.api.course;

import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class CourseDTOTest {
    @Test
    @DisplayName("Should create correctly CourseDTO with constructor no parameters")
    void test01CreateCourseDTO_ConstructorNoParameters() {
        CourseDTO courseDTO = new CourseDTO();
        assertNull(courseDTO.getId());
        assertNull(courseDTO.getName());
        assertNull(courseDTO.getDescription());
        assertNotNull(courseDTO.getFolders());
        assertTrue(courseDTO.getFolders().isEmpty());
    }

    @Test
    @DisplayName("Should create correctly CourseDTO passing name to construcor")
    void test02CreateCourseDTO_PassingNameToConstructor() {
        String name = "test";
        CourseDTO courseDTO = new CourseDTO(name);
        assertNull(courseDTO.getId());
        assertEquals(name, courseDTO.getName());
        assertNull(courseDTO.getDescription());
        assertNotNull(courseDTO.getFolders());
        assertTrue(courseDTO.getFolders().isEmpty());
    }

    @Test
    @DisplayName("Should all setters works correctly")
    void test03SetAllSettersWorkCorrectly() {
        String id = new ObjectId().toString();
        String name = "test";
        String description = "test";
        FolderDTO folderDTO = new FolderDTO();
        List<FolderDTO> folders = List.of(folderDTO);

        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setId(id);
        courseDTO.setName(name);
        courseDTO.setDescription(description);
        courseDTO.setFolders(folders);

        assertEquals(id, courseDTO.getId());
        assertEquals(name, courseDTO.getName());
        assertEquals(description, courseDTO.getDescription());
        assertEquals(folders, courseDTO.getFolders());

        courseDTO.setFolders(null);
        assertNotNull(courseDTO.getFolders());
        assertTrue(courseDTO.getFolders().isEmpty());
    }
}
