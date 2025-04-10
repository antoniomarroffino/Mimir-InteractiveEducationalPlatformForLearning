package ch.supsi.model.dto.api.promotionRequest;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.dto.api.PromotionRequestDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class PromotionRequestDTOTest {
    @Test
    @DisplayName("Should create new PromotionRequestDTO with constructor no parameteres")
    void test01CreatePromotionRequestDTO_ConstructorWithNoParameters() {
        PromotionRequestDTO promotionRequestDTO = new PromotionRequestDTO();
        assertNull(promotionRequestDTO.getEmail());
        assertNull(promotionRequestDTO.getRole());

        String validEmail = "valid@email.com";
        promotionRequestDTO.setEmail(validEmail);
        promotionRequestDTO.setRole(Role.ADMIN);
        assertEquals(validEmail, promotionRequestDTO.getEmail());
        assertEquals(Role.ADMIN, promotionRequestDTO.getRole());
    }

    @Test
    @DisplayName("Should create new PromotionRequestDTO passing parameters to constructor")
    void test02CreatePromotionRequestDTO_ConstructorWithParameters() {
        String validEmail = "valid@email.com";
        PromotionRequestDTO promotionRequestDTO = new PromotionRequestDTO(validEmail, Role.TEACHER);
        assertEquals(validEmail, promotionRequestDTO.getEmail());
        assertEquals(Role.TEACHER, promotionRequestDTO.getRole());
    }
}
