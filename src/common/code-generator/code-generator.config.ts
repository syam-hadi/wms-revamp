import { CodeModule } from './code-generator.enum';

export const CODE_GENERATOR_CONFIG = {
  defaultPadding: 6,
  defaultSeparator: '',
  prefixMapping: {
    [CodeModule.CONFIG]: 'CFG',
    [CodeModule.COUNTRY]: 'CTR',
    [CodeModule.PROVINCE]: 'PRV',
    [CodeModule.CITY]: 'CTY',
    [CodeModule.BANK]: 'BNK',
    [CodeModule.TAX]: 'TAX',
    [CodeModule.COMMODITY]: 'CMD',
  },
};
