import { ApiProperty } from '@nestjs/swagger';

export class ApiError {
  @ApiProperty({ default: false })
  public readonly success: boolean;

  @ApiProperty()
  public readonly message: string;

  @ApiProperty({ required: false })
  public readonly errors: unknown;

  @ApiProperty()
  public readonly timestamp: Date;

  @ApiProperty()
  public readonly path: string;

  constructor(
    success: boolean,
    message: string,
    errors: unknown,
    timestamp: Date,
    path: string,
  ) {
    this.success = success;
    this.message = message;
    this.errors = errors;
    this.timestamp = timestamp;
    this.path = path;
  }

  static of(message: string, path: string, errors: unknown = null): ApiError {
    return new ApiError(false, message, errors, new Date(), path);
  }
}
