package ch.supsi.service.user.api.changeRole.builder;

import ch.supsi.model.api.user.Role;
import ch.supsi.service.user.api.changeRole.strategy.ChangeRoleStrategy;

public interface IChangeRoleStrategyBuilder {
    ChangeRoleStrategy buildChangeRoleStrategy(Role role);
}
