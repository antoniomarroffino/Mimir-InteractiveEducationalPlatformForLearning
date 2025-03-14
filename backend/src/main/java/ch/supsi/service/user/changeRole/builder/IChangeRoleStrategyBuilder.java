package ch.supsi.service.user.changeRole.builder;

import ch.supsi.model.api.user.Role;
import ch.supsi.service.user.changeRole.strategy.ChangeRoleStrategy;

public interface IChangeRoleStrategyBuilder {
    ChangeRoleStrategy buildChangeRoleStrategy(Role role);
}
