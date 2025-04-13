package ch.supsi.service.badgeHolder;

import ch.supsi.mapper.BadgeHolderMapper;
import ch.supsi.model.api.BadgeHolder;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.dto.api.BadgeHolderDTO;
import ch.supsi.repository.BadgeHolderRepository;
import ch.supsi.service.badgeholder.BadgeHolderService;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class BadgeHolderServiceTest {
    @Inject
    BadgeHolderService badgeHolderService;

    @InjectMock
    BadgeHolderRepository badgeHolderRepository;

    @InjectMock
    BadgeHolderMapper badgeHolderMapper;

    @Test
    @DisplayName("Should return empty list when no badge holders")
    void test01GetAllBadgeHolders_EmptyList() {
        when(this.badgeHolderRepository.listAll()).thenReturn(Collections.emptyList());

        List<BadgeHolderDTO> result = this.badgeHolderService.getAllBadgeHolders();

        assertTrue(result.isEmpty());

        verify(this.badgeHolderRepository, times(1)).listAll();
        verifyNoInteractions(this.badgeHolderMapper);
    }

    @Test
    @DisplayName("Should return mapped BadgeHolderDTOs")
    void test02GetAllBadgeHolders_WithData() {
        List<BadgeHolder> holders = List.of(
                createTestBadgeHolder("oid1"),
                createTestBadgeHolder("oid2")
        );

        when(this.badgeHolderRepository.listAll()).thenReturn(holders);
        when(this.badgeHolderMapper.toDTO(any(BadgeHolder.class))).thenReturn(new BadgeHolderDTO());

        List<BadgeHolderDTO> result = this.badgeHolderService.getAllBadgeHolders();

        assertEquals(holders.size(), result.size());

        verify(this.badgeHolderRepository, times(1)).listAll();
        verify(this.badgeHolderMapper, times(holders.size())).toDTO(any(BadgeHolder.class));
    }

    @Test
    @DisplayName("Should throw when not found badgeHolder because azure oid does not exist")
    void test04GetBadgeHolderByAzureOID_NotFound() {
        String oid = "nonexistent";
        when(this.badgeHolderRepository.findByAzureOIDOptional(oid)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.badgeHolderService.getBadgeHolderByAzureOID(oid)
        );

        assertEquals("Badge holder with Azure OID " + oid + " not found", exception.getMessage());

        verify(this.badgeHolderRepository, times(1)).findByAzureOIDOptional(oid);
        verifyNoInteractions(this.badgeHolderMapper);
    }

    @Test
    @DisplayName("Should return mapped BadgeHolderDTO founded by AzureOID")
    void test05GetBadgeHolderByAzureOID_Found() {
        String oid = "testOID";
        BadgeHolder holder = createTestBadgeHolder(oid);
        BadgeHolderDTO dto = new BadgeHolderDTO();

        when(this.badgeHolderRepository.findByAzureOIDOptional(oid)).thenReturn(Optional.of(holder));
        when(this.badgeHolderMapper.toDTO(holder)).thenReturn(dto);

        BadgeHolderDTO result = this.badgeHolderService.getBadgeHolderByAzureOID(oid);

        assertSame(dto, result);

        verify(this.badgeHolderRepository, times(1)).findByAzureOIDOptional(oid);
        verify(this.badgeHolderMapper, times(1)).toDTO(holder);
    }

    @Test
    @DisplayName("Should validate input parameters")
    void test06AddBadgeToHolder_Validation() {
        assertAll(
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.badgeHolderService.addBadgeToHolder(null, new Badge())
                ),

                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.badgeHolderService.addBadgeToHolder("oid", null)
                ),

                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.badgeHolderService.addBadgeToHolder(null, null)
                )
        );
    }

    @Test
    @DisplayName("Should create new holder when not exists")
    void test07AddBadgeToHolder_NewHolder() {
        String oid = "newOID";
        Badge badge = new Badge();

        when(this.badgeHolderRepository.findByAzureOIDOptional(oid))
                .thenReturn(Optional.empty());

        this.badgeHolderService.addBadgeToHolder(oid, badge);

        verify(this.badgeHolderRepository, times(1)).persistOrUpdate((BadgeHolder) argThat(holder ->
                ((BadgeHolder) (holder)).azureOID.equals(oid) &&
                        ((BadgeHolder) (holder)).badges.size() == 1 &&
                        ((BadgeHolder) (holder)).badges.getFirst() == badge
        ));
    }

    @Test
    @DisplayName("Should update existing holder")
    void test08AddBadgeToHOlder_ExistingHolder() {
        String oid = "existingOID";
        Badge existingBadge = new Badge();
        Badge newBadge = new Badge();

        BadgeHolder holder = createTestBadgeHolder(oid);
        holder.badges.add(existingBadge);

        when(this.badgeHolderRepository.findByAzureOIDOptional(oid))
                .thenReturn(Optional.of(holder));

        this.badgeHolderService.addBadgeToHolder(oid, newBadge);

        assertEquals(2, holder.badges.size());
        assertTrue(holder.badges.contains(newBadge));

        verify(badgeHolderRepository, times(1)).persistOrUpdate(holder);
    }

    private BadgeHolder createTestBadgeHolder(String azureOID) {
        BadgeHolder holder = new BadgeHolder();
        holder.id = new ObjectId();
        holder.azureOID = azureOID;
        return holder;
    }
}
