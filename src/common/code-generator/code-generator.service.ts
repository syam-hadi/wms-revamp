import { Injectable } from '@nestjs/common';
import { GenerateCodeOptions } from './interfaces/generate-code-options.interface';
import { CODE_GENERATOR_CONFIG } from './code-generator.config';
import { CodeModule } from './code-generator.enum';

@Injectable()
export class CodeGeneratorService {
  // In-memory placeholder for sequence storage during development.
  // This is an implementation detail and completely hidden from consumers.
  // It will be replaced by a robust mechanism (e.g., Redis/DB) when business rules are finalized.
  private sequenceStorage = new Map<CodeModule, number>();

  async generate(options: GenerateCodeOptions): Promise<string> {
    const { module } = options;

    const prefix = CODE_GENERATOR_CONFIG.prefixMapping[module] || 'UNK';
    const padding = CODE_GENERATOR_CONFIG.defaultPadding;
    const separator = CODE_GENERATOR_CONFIG.defaultSeparator;

    // Simulate sequence fetching (placeholder)
    const currentVal = this.sequenceStorage.get(module) || 0;
    const nextVal = currentVal + 1;
    this.sequenceStorage.set(module, nextVal);

    // Format the code
    const sequenceStr = nextVal.toString().padStart(padding, '0');
    const result = `${prefix}${separator}${sequenceStr}`;

    return await Promise.resolve(result);
  }
}
