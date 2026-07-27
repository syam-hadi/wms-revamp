class BaseEntity {
  createdAt!: Date;
  createdBy!: string | null;
  updatedAt!: Date | null;
  updatedBy!: string | null;
  deletedAt!: Date | null;
  deletedBy!: string | null;
}

class CountryEntity extends BaseEntity {
  id!: string;
  code!: string;
  name!: string;
}

const entity = new CountryEntity();
Object.assign(entity, {
  id: '1',
  code: 'ID',
  name: 'Indonesia',
  createdAt: new Date('2024-01-01'),
  createdBy: 'sys',
  updatedAt: new Date('2024-01-01'),
  updatedBy: 'sys',
  deletedAt: null,
  deletedBy: null
});

console.log('--- WITHOUT DEFAULTS ---');
console.log(JSON.stringify(entity, null, 2));
