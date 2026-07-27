export abstract class BaseEntity {
  createdAt!: Date;
  createdBy: string | null = null;
  updatedAt: Date | null = null;
  updatedBy: string | null = null;
  deletedAt: Date | null = null;
  deletedBy: string | null = null;

  get isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  get isCreated(): boolean {
    return this.createdAt !== undefined;
  }

  restore(deletedBy?: string): void {
    this.deletedAt = null;
    this.deletedBy = deletedBy ?? null;
  }

  delete(by: string): void {
    this.deletedAt = new Date();
    this.deletedBy = by;
  }

  touch(by: string): void {
    this.updatedAt = new Date();
    this.updatedBy = by;
  }

  create(by: string): void {
    this.createdAt = new Date();
    this.createdBy = by;
  }

  toJSON(): Record<string, any> {
    const {
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
      deletedAt,
      deletedBy,
      ...businessFields
    } = this as any;

    return {
      ...businessFields,
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
      deletedAt,
      deletedBy,
    };
  }
}
