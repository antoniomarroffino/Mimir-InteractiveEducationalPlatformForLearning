package ch.supsi.service.user.changeRole.builder;

import ch.supsi.model.api.user.Role;
import ch.supsi.service.user.changeRole.strategy.IChangeRoleStrategy;

public interface IChangeRoleStrategyBuilder {
    IChangeRoleStrategy buildChangeRoleStrategy(Role role);
}
