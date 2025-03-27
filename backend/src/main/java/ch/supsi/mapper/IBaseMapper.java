package ch.supsi.mapper;

public interface IBaseMapper<E, D> {
    D toDTO(E entity);

    E toEntity(D dto);
}
