# Architecture Guidelines & Decisions

This document outlines the key architectural decisions and guidelines adopted in the WMS Enterprise repository.

## 1. Soft Delete Strategy
**Decision:** Soft delete is centralized in `BaseRepository`.
**Reasoning:**
Centralizing the soft delete mechanism (e.g., `deletedAt`, `deletedBy`) in the abstract `BaseRepository` ensures consistency across all modules. This approach prevents individual developers from forgetting to implement soft delete correctly and avoids code duplication across hundreds of entity repositories.

## 2. Cross-Module Repository Dependency
**Decision:** Injecting a Repository from another module is allowed **only for referential validation** (e.g., checking if a foreign key exists).
**Reasoning:**
Strict Hexagonal Architecture dictates that modules should communicate only via Services (or Events). However, for simple foreign-key existence checks, injecting another module's Service might create circular dependencies or unnecessary coupling at the business-logic layer. Injecting the target module's Repository purely for existence validation (`existsById`) is an accepted pragmatic trade-off to maintain performance and avoid circular imports.
*Note: Using a cross-module repository for executing business logic or mutating data is strictly prohibited.*

## 3. Cache Architecture
**Decision:** `CacheService` is injected directly into Application Services.
**Reasoning:**
While strictly `CacheService` resides in the `infrastructure` layer and Services should depend on a generic `CachePort`, we have adopted a pragmatic approach (YAGNI). Since Redis is our only caching mechanism and `CacheService` already acts as an abstraction over the underlying `RedisService`, we allow direct injection of `CacheService`. Introducing additional ports/adapters for cache would be over-engineering at this stage.

## 4. Entity Decimal Representation (`Prisma.Decimal`)
**Decision:** `Prisma.Decimal` is temporarily retained in Domain Entities (e.g., `TaxEntity`, `RateEntity`).
**Reasoning (Technical Debt):**
Strict Domain Isolation requires Entities to be completely agnostic of the ORM (Prisma). Currently, some entities import `Prisma.Decimal` to accurately represent decimal values from the database without precision loss. Creating a custom `Decimal` wrapper or using external libraries like `decimal.js` at the Domain level would require significant refactoring and add unnecessary complexity (violating YAGNI).
This is documented as a known *technical debt*. For now, `Prisma.Decimal` is accepted purely as a type representation to maintain simplicity and precision.
