const env = process.env.NODE_ENV || 'development';
const prefix = `${env}:master`;

export class CacheKeys {
  static config = {
    group: (group: string) => `${prefix}:config:${group.toLowerCase()}`,
    pattern: (group: string) => `${prefix}:config:${group.toLowerCase()}*`,
    detail: (id: string) => `${prefix}:config:id:${id}`,
  };

  static company = {
    detail: (id: string) => `${prefix}:company:${id}`,
    list: () => `${prefix}:company:list`,
  };

  static branch = {
    detail: (id: string) => `${prefix}:branch:${id}`,
    list: (companyId: string) => `${prefix}:company:${companyId}:branches`,
  };

  static department = {
    list: (companyId: string) => `${prefix}:company:${companyId}:departments`,
  };

  static employee = {
    detail: (id: string) => `${prefix}:employee:${id}`,
  };

  static country = {
    detail: (id: string) => `${prefix}:country:${id}`,
    list: () => `${prefix}:country:list`,
  };

  static province = {
    detail: (id: string) => `${prefix}:province:${id}`,
    list: () => `${prefix}:province:list`,
  };

  static city = {
    detail: (id: string) => `${prefix}:city:${id}`,
    list: () => `${prefix}:city:list`,
  };

  static bank = {
    detail: (id: string) => `${prefix}:bank:${id}`,
    list: () => `${prefix}:bank:list`,
  };

  static tax = {
    detail: (id: string) => `${prefix}:tax:${id}`,
    list: () => `${prefix}:tax:list`,
  };
}
