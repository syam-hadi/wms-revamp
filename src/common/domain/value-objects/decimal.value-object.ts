import { Decimal } from 'decimal.js';

export class DecimalValue {
  private readonly value: Decimal;

  private constructor(value: Decimal.Value) {
    this.value = new Decimal(value);
  }

  public static of(value: Decimal.Value): DecimalValue {
    return new DecimalValue(value);
  }

  public static zero(): DecimalValue {
    return new DecimalValue(0);
  }

  public toString(): string {
    return this.value.toString();
  }

  public toNumber(): number {
    return this.value.toNumber();
  }

  /**
   * Architectural Compromise:
   *
   * Dalam kondisi ideal, Domain Value Object tidak boleh memiliki logic terkait HTTP serialization (seperti toJSON).
   * Namun, karena arsitektur Golden Template saat ini langsung meneruskan Entity dari Service ke Controller sebagai HTTP Response
   * (tanpa melalui layer DTO/Mapper terpisah), metode ini dipertahankan.
   *
   * Ini memastikan bahwa saat NestJS melakukan JSON.stringify() pada Entity,
   * DecimalValue akan di-serialize menjadi `number` untuk menjaga kompabilitas dengan tipe API Response
   * dan kontrak Swagger saat ini, alih-alih menjadi `string` bawaan dari decimal.js.
   *
   * Menghindari pembuatan Mapper khusus hanya untuk DecimalValue sesuai dengan aturan YAGNI dan KISS.
   */
  public toJSON(): number {
    return this.value.toNumber();
  }

  public equals(other: DecimalValue): boolean {
    return this.value.equals(other.value);
  }

  // Note: Mathematical operations (add, subtract, multiply, divide, etc.)
  // are deliberately excluded for now (YAGNI).
  // They can be added here easily when the business logic requires them.
}
