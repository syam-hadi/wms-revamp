const fs = require('fs');
const path = require('path');

const modules = ["config", "country", "province", "city", "bank", "tax", "commodity", "rate"];
const basePath = "c:/WIMS REVAMP/wms-revamp-api/src/modules/master";

const report = {};

for (const mod of modules) {
    report[mod] = {
        controller: {},
        service: {},
        repository: {},
        validation: {},
        contract: {},
        swagger: {},
        cache: {},
        entity: {}
    };

    // Controller
    try {
        const controllerPath = path.join(basePath, mod, 'controllers', `${mod}.controller.ts`);
        const content = fs.readFileSync(controllerPath, 'utf-8');
        
        const apiTagsMatch = content.match(/@ApiTags\(['"](.*?)['"]\)/);
        report[mod].controller.apiTags = apiTagsMatch ? apiTagsMatch[1] : null;
        report[mod].controller.hasGenericResponse = content.includes('@ApiGenericResponse(');
        report[mod].controller.operationIds = [...content.matchAll(/operationId:\s*['"](.*?)['"]/g)].map(m => m[1]);
        const routePatternMatch = content.match(/@Controller\(['"](.*?)['"]\)/);
        report[mod].controller.routePattern = routePatternMatch ? routePatternMatch[1] : null;
    } catch (e) {
        report[mod].controller.error = e.message;
    }

    // Service
    try {
        const servicePath = path.join(basePath, mod, 'services', `${mod}.service.ts`);
        const content = fs.readFileSync(servicePath, 'utf-8');
        report[mod].service.hasPrisma = content.includes('prisma') || content.includes('PrismaService');
        report[mod].service.usesCache = content.includes('CacheService');
        report[mod].cache.keys = [...content.matchAll(/this\.cacheService\.[a-zA-Z]+\(\s*['"](.*?)['"]/g)].map(m => m[1]);
        report[mod].cache.invalidates = [...content.matchAll(/this\.cacheService\.invalidatePrefix\(\s*['"](.*?)['"]/g)].map(m => m[1]);
        report[mod].cache.remember = content.includes('.remember(');
    } catch (e) {
        report[mod].service.error = e.message;
    }

    // Repository
    try {
        const repoPath = path.join(basePath, mod, 'repositories', `${mod}.repository.ts`);
        const prismaRepoPath = path.join(basePath, mod, 'repositories', `prisma-${mod}.repository.ts`);
        if (fs.existsSync(prismaRepoPath)) {
            const content = fs.readFileSync(prismaRepoPath, 'utf-8');
            report[mod].repository.extendsBase = content.includes('extends BaseRepository');
            report[mod].repository.implementsInterface = content.includes(`implements ${mod.charAt(0).toUpperCase() + mod.slice(1)}Repository`);
            report[mod].repository.hasSoftDelete = content.includes('deletedAt: null');
            report[mod].repository.hasApplyFilter = content.includes('applyFilter(');
            report[mod].repository.hasApplySort = content.includes('applySort(');
        } else {
            report[mod].repository.prismaRepoMissing = true;
        }
    } catch (e) {
        report[mod].repository.error = e.message;
    }

    // Entity
    try {
        const entityPath = path.join(basePath, mod, 'entities', `${mod}.entity.ts`);
        const content = fs.readFileSync(entityPath, 'utf-8');
        report[mod].entity.hasApiProperty = content.includes('@ApiProperty');
        report[mod].entity.hasSwagger = content.includes('@nestjs/swagger');
    } catch (e) {
        report[mod].entity.error = e.message;
    }

    // Contracts (Examples)
    try {
        const contractPath = path.join(basePath, mod, 'contracts', `${mod}.contract.ts`);
        const content = fs.readFileSync(contractPath, 'utf-8');
        report[mod].contract.examples = [...content.matchAll(/example:\s*(['"]?.*?['"]?)\s*[,}]/g)].map(m => m[1]);
    } catch (e) {
        report[mod].contract.error = e.message;
    }
}

fs.writeFileSync('c:/WIMS REVAMP/wms-revamp-api/audit-report.json', JSON.stringify(report, null, 2));
console.log('Audit completed');
