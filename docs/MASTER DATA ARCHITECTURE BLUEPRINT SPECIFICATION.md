# MASTER DATA ARCHITECTURE BLUEPRINT SPECIFICATION v1.0

## 1. Out of Scope

This blueprint focuses strictly on Master Data standardizations. This blueprint SHALL NOT include or mandate the implementation of the following enterprise features, which are scheduled for subsequent roadmap phases:

- Authentication & JWT
- Authorization & RBAC
- Audit Trail
- Workflow & Approvals
- Domain Events & Event Bus
- CQRS
- Unit Of Work & Distributed Transactions
- Microservices & Background Jobs

These features MUST NOT be considered deficiencies in the current v1.0 Blueprint.

## 2. Architecture Governance

The following rules are MANDATORY and SHALL be strictly adhered to by all developers during the development of Master Data modules.

### Layer Separation & Dependency Direction

- Dependency MUST flow inwards: `Controller` -> `Service` -> `Repository Interface`.
- `Controller` SHALL ONLY communicate with `Service`.
- `Service` SHALL NOT import Prisma Client, Prisma specific typings, or any database-specific driver.
- `Repository` MUST be the only layer allowed to access Prisma or the underlying database.

### Folder Rules

- Every Master Data module MUST contain the following directories: `contracts/`, `controllers/`, `entities/`, `repositories/`, `services/`, and `validations/`.
- No other directories SHALL be created at the module root without architectural approval.

### Controller Rules

- `Controller` MUST NOT contain any business logic.
- Every endpoint in the `Controller` MUST have explicit return types.
- Every endpoint MUST use `@ResponseMessage(...)` for global standard API wrapping.

### Service Rules

- `Service` MUST contain all business logic and caching orchestration.
- `Service` MUST depend exclusively on Repository interfaces, not concrete implementations.

### Repository Rules

- The domain layer MUST define an abstract `Repository` interface.
- `PrismaRepository` MUST implement the interface and handle all Prisma queries.
- Repositories MUST NOT contain caching logic.

### Validation Rules

- All input validation MUST use Joi via `JoiValidationPipe`.
- Pagination and common query validation MUST use composition from a centralized `BaseQueryValidation`.

### Mapper Rules

- Prisma models MUST be mapped to Domain Entities before returning to the `Service`.
- Mappers MUST be implemented as a private `toEntity` method within the concrete `PrismaRepository`.
- Domain Entities MUST NOT contain Prisma-specific annotations or properties.

### Redis Rules

- Redis caching MUST ONLY be accessed through the global `CacheService`.
- `CacheService` interactions SHALL ONLY occur within the `Service` layer.

### Swagger Rules

- All Controllers MUST be decorated with `@ApiTags`.
- Every endpoint MUST be decorated with `@ApiOperation`.
- Every endpoint MUST explicitly define its response schema using `@ApiOkResponse`, `@ApiCreatedResponse`, or `@ApiPaginatedResponse`.

### Contract Rules

- `Contract` (DTO) classes MUST ONLY contain fields provided by the client.
- System-generated fields (e.g., `createdBy`, `updatedBy`) MUST NOT be present in Request Contracts.

### Naming Convention

- File naming MUST follow the `{module-name}.{type}.ts` format (e.g., `company.controller.ts`).
- Interfaces MUST NOT use the `I` prefix.

## 3. Standardization Pillars (Engineering Standards)

### Query Standard

- All collection endpoints MUST accept a contract that extends `BaseQueryContract` containing `page`, `limit`, `search`, `sortBy`, `sortOrder`, and `status`.

### Pagination Standard

- All paginated endpoints MUST return `PageResult<T>`.

### Response Standard

- All REST API endpoint responses MUST be wrapped in the global JSON envelope utilizing the `@ResponseMessage()` decorator.

### Error Code Convention

- Exception throwing MUST use the central `Assertion` utility.
- Error messages MUST be centralized in `src/common/constants/messages.ts`.
- Error codes MUST strictly follow the `MODULE_ERROR_TYPE` format (e.g., `COMPANY_NOT_FOUND`, `WAREHOUSE_DUPLICATE_CODE`).

### Cache Convention

- Cache keys MUST be registered in `src/infrastructure/redis/constants/cache.keys.ts`.
- Cache key strings MUST follow the format:
  - Details: `wms:{module}:id:{id}`
  - Lists: `wms:{module}:list:{queryHash}`
  - Groups: `wms:{module}:group:{groupId}`

## 4. Blueprint Compliance Checklist

Before merging any Pull Request (PR) for a Master Data module, the code reviewer MUST verify compliance using the following checklist:

- [ ] **Folder Structure**: Adheres to the 6 mandatory directories.
- [ ] **Dependency Direction**: Correct flow (Controller -> Service -> Repository Interface).
- [ ] **Contract**: Request Contracts contain no system fields (e.g., `createdBy`).
- [ ] **Validation**: Uses Joi and composes `BaseQueryValidation` for queries.
- [ ] **Repository Pattern**: Domain interface exists and Prisma implementation is isolated.
- [ ] **Mapping**: Private `toEntity` mapper transforms Prisma models to Domain Entities.
- [ ] **Swagger**: `@ApiOperation` and precise Response decorators are fully defined.
- [ ] **Response**: `@ResponseMessage` is applied to all endpoints.
- [ ] **Pagination**: Returns `PageResult<T>` and uses standard `@ApiPaginatedResponse`.
- [ ] **Cache**: Uses `CacheService` exclusively at the Service layer.
- [ ] **Cache Convention**: Keys are centralized in `cache.keys.ts` following `wms:{module}:...`.
- [ ] **Error Convention**: Errors use centralized constants (`Messages.{MODULE}.{ERROR}`).
- [ ] **Naming**: Filenames and class names strictly follow conventions.

## 5. Blueprint Adoption Roadmap

### Phase 0: Architecture Governance

- **Objective**: Establish the Master Data Specification as the absolute source of truth.
- **Deliverables**: MASTER DATA ARCHITECTURE BLUEPRINT SPECIFICATION v1.0 document.
- **Exit Criteria**: Document is approved and distributed to all engineering teams.

### Phase 1: Internal Framework Standardization

- **Objective**: Extract common components to the `src/common` namespace.
- **Deliverables**: `BaseQueryContract`, `BaseQueryValidation`, `@ApiPaginatedResponse`, and centralized `Messages` and `CacheKeys`.
- **Exit Criteria**: Common components are fully typed, tested, and available for import.

### Phase 2: Blueprint Extraction

- **Objective**: Refactor the reference module (`Config Module`) to strictly adhere to Phase 1 components and this Specification.
- **Deliverables**: Fully compliant `Config Module`.
- **Exit Criteria**: `Config Module` passes 100% of the Blueprint Compliance Checklist.

### Phase 3: Module Generator Preparation

- **Objective**: Automate module creation to enforce standards and eliminate human error.
- **Deliverables**: CLI tool/Schematic (e.g., Plop.js template) mirroring the finalized `Config Module`.
- **Exit Criteria**: Running the generator successfully yields a 100% compliant module structure.

### Phase 4: Master Data Adoption

- **Objective**: Rapidly develop remaining Master Data modules.
- **Deliverables**: Company, Branch, Warehouse, Vendor, Customer, Product, UOM, etc.
- **Exit Criteria**: All Master Data modules implemented, reviewed against the Checklist, and merged.

## 6. Blueprint Certification

- **Status**: Certified
- **Version**: 1.0
- **Blueprint Scope**: Master Data Modules
- **Certification Result**: READY FOR GENERATOR

## 7. Future Evolution

This Blueprint is designed to be evolutionary. Future versions SHALL maintain backward compatibility for existing Master Data modules while introducing enterprise-grade capabilities.

- **Version 1.1**: Authentication Integration (JWT, Global Guards).
- **Version 1.2**: RBAC Integration (Permission decorators, Role schemas).
- **Version 1.3**: Audit Trail (Change Data Capture or Entity Interceptors).
- **Version 2.0**: Business Modules (Unit of Work, Transaction Context, Domain Events for Inventory, Movement, and core WMS business logic).
