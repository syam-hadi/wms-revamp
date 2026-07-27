export abstract class BaseMapper<TEntity, TModel> {
  abstract toEntity(model: TModel): TEntity;

  toEntities(models: TModel[]): TEntity[] {
    return models.map((model) => this.toEntity(model));
  }
}
