import { CodeModule } from '../code-generator.enum';
import { GenerateCodeContext } from './generate-code-context.interface';

export interface GenerateCodeOptions {
  module: CodeModule;
  context?: GenerateCodeContext;
}
