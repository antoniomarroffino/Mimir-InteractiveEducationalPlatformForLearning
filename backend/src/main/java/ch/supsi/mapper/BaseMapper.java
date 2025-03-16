package ch.supsi.mapper;

public interface BaseMapper<E, D> {
    D toDTO(E entity);
    E toEntity(D dto);
}
