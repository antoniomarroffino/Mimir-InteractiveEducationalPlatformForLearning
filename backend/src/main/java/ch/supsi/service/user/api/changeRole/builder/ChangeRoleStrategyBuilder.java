package ch.supsi.service.user.api.changeRole.builder;

import ch.supsi.model.api.user.Role;
import ch.supsi.service.user.api.changeRole.strategy.ChangeRoleStrategy;
import ch.supsi.service.user.api.changeRole.strategy.DemoteStrategy;
import ch.supsi.service.user.api.changeRole.strategy.InvalidAdminStrategy;
import ch.supsi.service.user.api.changeRole.strategy.PromoteStrategy;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class ChangeRoleStrategyBuilder implements IChangeRoleStrategyBuilder {
    private final Map<Role, ChangeRoleStrategy> changeRoleStrategyMap = new HashMap<>();

    @Inject
    public ChangeRoleStrategyBuilder(PromoteStrategy promoteStrategy,
                                     DemoteStrategy demoteStrategy,
                                     InvalidAdminStrategy invalidAdminStrategy) {
        this.changeRoleStrategyMap.put(Role.STUDENT, demoteStrategy);
        this.changeRoleStrategyMap.put(Role.TEACHER, promoteStrategy);
        this.changeRoleStrategyMap.put(Role.ADMIN, invalidAdminStrategy);
    }

    @Override
    public ChangeRoleStrategy buildChangeRoleStrategy(Role role) {
        return this.changeRoleStrategyMap.get(role);
    }
}
