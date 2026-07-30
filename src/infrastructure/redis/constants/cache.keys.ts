export class CacheKeys {
  static config = {
    group: (group: string) => `config:${group.toLowerCase()}`,
    pattern: (group: string) => `config:${group.toLowerCase()}*`,
    detail: (id: string) => `config:id:${id}`,
  };

  static company = {
    detail: (id: string) => `company:${id}`,
    list: () => `company:list`,
  };

  static branch = {
    detail: (id: string) => `branch:${id}`,
    list: (companyId: string) => `company:${companyId}:branches`,
  };

  static department = {
    list: (companyId: string) => `company:${companyId}:departments`,
  };

  static employee = {
    detail: (id: string) => `employee:${id}`,
  };

  static country = {
    detail: (id: string) => `country:${id}`,
    list: () => `country:list`,
  };

  static province = {
    detail: (id: string) => `province:${id}`,
    list: () => `province:list`,
  };

  static city = {
    detail: (id: string) => `city:${id}`,
    list: () => `city:list`,
  };

  static bank = {
    detail: (id: string) => `bank:${id}`,
    list: () => `bank:list`,
  };

  static tax = {
    detail: (id: string) => `tax:${id}`,
    list: () => `tax:list`,
  };

  static commodity = {
    detail: (id: string) => `commodity:${id}`,
    list: () => `commodity:list`,
  };

  static rate = {
    detail: (id: string) => `rate:${id}`,
    list: () => `rate:list`,
  };

  static currency = {
    detail: (id: string) => `currency:${id}`,
    list: () => `currency:list`,
  };
  static depot = {
    detail: (id: string) => `depot:${id}`,
    list: () => `depot:list`,
  };

  static port = {
    detail: (id: string) => `port:${id}`,
    list: () => `port:list`,
  };

  static unitOfMeasurement = {
    detail: (id: string) => `uom:${id}`,
    list: () => `uom:list`,
  };

  static vessel = {
    detail: (id: string) => `vessel:${id}`,
    list: () => `vessel:list`,
  };
}
