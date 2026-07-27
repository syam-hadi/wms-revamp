class BaseEntity {
    createdAt;
    createdBy = null;
    updatedAt = null;
    updatedBy = null;
    deletedAt = null;
    deletedBy = null;
}
class CountryEntity extends BaseEntity {
    id;
    code;
    name;
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
console.log('--- WITH DEFAULTS ---');
console.log(JSON.stringify(entity, null, 2));
