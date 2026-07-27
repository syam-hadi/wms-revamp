export class ApiResponse<T> {
  private constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly data: T,
    public readonly timestamp: Date,
  ) {}

  static success<T>(data: T, message = 'Success.'): ApiResponse<T> {
    return new ApiResponse(true, message, data, new Date());
  }
}
