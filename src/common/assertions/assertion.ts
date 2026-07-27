import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class Assertion {
  private constructor() {}

  static notFound<T>(
    value: T | null | undefined,
    message = 'Data not found.',
  ): asserts value is NonNullable<T> {
    if (value == null) {
      throw new NotFoundException(message);
    }
  }

  static required<T>(
    value: T | null | undefined,
    message = 'Value is required.',
  ): asserts value is NonNullable<T> {
    if (value == null || value === '') {
      throw new BadRequestException(message);
    }
  }

  static duplicate(
    isDuplicate: boolean,
    message = 'Data already exists.',
  ): void {
    if (isDuplicate) {
      throw new ConflictException(message);
    }
  }

  static isTrue(condition: boolean, message = 'Invalid request.'): void {
    if (!condition) {
      throw new BadRequestException(message);
    }
  }

  static isFalse(condition: boolean, message = 'Invalid request.'): void {
    if (condition) {
      throw new BadRequestException(message);
    }
  }

  static authorized(condition: boolean, message = 'Unauthorized.'): void {
    if (!condition) {
      throw new UnauthorizedException(message);
    }
  }

  static forbidden(condition: boolean, message = 'Forbidden.'): void {
    if (!condition) {
      throw new ForbiddenException(message);
    }
  }
}
