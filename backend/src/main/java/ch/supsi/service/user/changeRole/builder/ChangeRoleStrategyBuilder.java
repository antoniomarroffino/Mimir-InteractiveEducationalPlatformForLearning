package ch.supsi.service.user.changeRole.builder;

import ch.supsi.model.api.user.Role;
import ch.supsi.service.user.changeRole.strategy.DemoteStrategy;
import ch.supsi.service.user.changeRole.strategy.IChangeRoleStrategy;
import ch.supsi.service.user.changeRole.strategy.InvalidAdminStrategy;
import ch.supsi.service.user.changeRole.strategy.PromoteStrategy;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class ChangeRoleStrategyBuilder implements IChangeRoleStrategyBuilder {
    private final Map<Role, IChangeRoleStrategy> changeRoleStrategyMap = new HashMap<>();

    @Inject
    public ChangeRoleStrategyBuilder(PromoteStrategy promoteStrategy,
                                     DemoteStrategy demoteStrategy,
                                     InvalidAdminStrategy invalidAdminStrategy) {
        this.changeRoleStrategyMap.put(Role.STUDENT, demoteStrategy);
        this.changeRoleStrategyMap.put(Role.TEACHER, promoteStrategy);
        this.changeRoleStrategyMap.put(Role.ADMIN, invalidAdminStrategy);
    }

    @Override
    public IChangeRoleStrategy buildChangeRoleStrategy(Role role) {
        IChangeRoleStrategy changeRoleStrategy = this.changeRoleStrategyMap.get(role);
        if (changeRoleStrategy == null) {
            throw new UnsupportedOperationException("Role not supported: " + role);
        }
        return changeRoleStrategy;
    }
}
