export class ApiError {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly errors: unknown,
    public readonly timestamp: Date,
    public readonly path: string,
  ) {}

  static of(message: string, path: string, errors: unknown = null): ApiError {
    return new ApiError(false, message, errors, new Date(), path);
  }
}
