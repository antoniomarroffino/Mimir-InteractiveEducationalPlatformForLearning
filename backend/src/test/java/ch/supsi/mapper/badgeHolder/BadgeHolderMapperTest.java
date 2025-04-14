package ch.supsi.mapper.badgeHolder;

import ch.supsi.mapper.BadgeHolderMapper;
import ch.supsi.mapper.BadgeMapper;
import ch.supsi.model.api.BadgeHolder;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.BadgeHolderDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class BadgeHolderMapperTest {
    @Inject
    BadgeHolderMapper badgeHolderMapper;

    @InjectMock
    BadgeMapper badgeMapper;

    @Test
    @DisplayName("Should return null because BadgeHolderEntity passed is null")
    void test01ToDTO_ReturnsNullBadgeHolderEntityIsNull() {
        BadgeHolderDTO dto = this.badgeHolderMapper.toDTO(null);
        assertNull(dto);
        verifyNoInteractions(this.badgeMapper);
    }

    @Test
    @DisplayName("Should return BadgeHolderDTO passing valid BadgeHolderEntity")
    void test02ToDTO_ReturnsValidBadgeHolderEntity() {
        ObjectId id = new ObjectId();
        String azureOid = "test-azure-oid";
        List<Badge> badgeList = List.of(new Badge(BadgeType.BEST_ATTEMPT, azureOid));
        BadgeHolder badgeHolder = new BadgeHolder();
        badgeHolder.id = id;
        badgeHolder.azureOID = azureOid;
        badgeHolder.badges = badgeList;

        BadgeHolderDTO dto = this.badgeHolderMapper.toDTO(badgeHolder);
        assertNotNull(dto);
        assertEquals(id.toString(), dto.getId());
        assertNotNull(dto.getUser());
        assertEquals(badgeHolder.azureOID, dto.getUser().getAzureOid());
        assertNull(dto.getUser().getName());
        assertNull(dto.getUser().getEmail());
        assertNull(dto.getUser().getRole());
        assertEquals(badgeHolder.badges.size(), dto.getBadges().size());

        verify(this.badgeMapper, times(badgeList.size())).toDTO(any(Badge.class));
    }

    @Test
    @DisplayName("Should return null because BadgeHolderDTO passed is null")
    void test03ToEntity_ReturnsNullBadgeHolderDTOIsNull() {
        BadgeHolder entity = this.badgeHolderMapper.toEntity(null);
        assertNull(entity);
        verifyNoInteractions(this.badgeMapper);
    }

    @Test
    @DisplayName("Should return new BadgeHolderEntity passing BadgeHolderDTO with id null")
    void test04ToEntity_ReturnsValidBadgeHolderDTOWithIdIsNull() {
        String azureOid = "test-azure-oid";
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(azureOid);
        List<BadgeDTO> badgeDTOList = List.of(new BadgeDTO());

        BadgeHolderDTO badgeHolderDTO = new BadgeHolderDTO();
        badgeHolderDTO.setId(null);
        badgeHolderDTO.setUser(userWithoutCoursesDTO);
        badgeHolderDTO.setBadges(badgeDTOList);

        BadgeHolder entity = this.badgeHolderMapper.toEntity(badgeHolderDTO);
        assertNotNull(entity);
        assertNull(entity.id);
        assertEquals(azureOid, entity.azureOID);
        assertEquals(badgeDTOList.size(), entity.badges.size());

        verify(this.badgeMapper, times(badgeDTOList.size())).toEntity(any(BadgeDTO.class));
    }

    @Test
    @DisplayName("Should return new BadgeHolderEntity passing BadgeHolderDTO with id not null")
    void test05ToEntity_ReturnsValidBadgeHolderDTOWithIdNotNull() {
        ObjectId id = new ObjectId();
        String azureOid = "test-azure-oid";
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(azureOid);
        List<BadgeDTO> badgeDTOList = List.of(new BadgeDTO());

        BadgeHolderDTO badgeHolderDTO = new BadgeHolderDTO();
        badgeHolderDTO.setId(id.toString());
        badgeHolderDTO.setUser(userWithoutCoursesDTO);
        badgeHolderDTO.setBadges(badgeDTOList);

        BadgeHolder entity = this.badgeHolderMapper.toEntity(badgeHolderDTO);
        assertNotNull(entity);
        assertEquals(id, entity.id);
        assertEquals(azureOid, entity.azureOID);
        assertEquals(badgeDTOList.size(), entity.badges.size());

        verify(this.badgeMapper, times(badgeDTOList.size())).toEntity(any(BadgeDTO.class));
    }
}
