import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty()
  public readonly success: boolean;

  @ApiProperty()
  public readonly message: string;

  public readonly data: T;

  @ApiProperty()
  public readonly timestamp: Date;

  constructor(success: boolean, message: string, data: T, timestamp: Date) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = timestamp;
  }

  static success<T>(data: T, message = 'Success.'): ApiResponse<T> {
    return new ApiResponse(true, message, data, new Date());
  }
}
