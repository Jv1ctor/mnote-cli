export interface IMapper<E, D, O = undefined> {
  toDto(entity: E, options: O): D
  toEntity(dto: D): E
}
