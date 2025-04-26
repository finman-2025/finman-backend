# Finman Backend Technical Documentation

## Project Overview
Finman is a NestJS-based backend service using Prisma ORM with PostgreSQL database. This document serves as a guide for implementing new features and understanding the project structure.

## Implementation Guide

### 1. Database Layer (Prisma & PostgreSQL)

#### Database Setup
1. Database configuration is managed in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Creating Models
1. Define models in `prisma/schema.prisma`:
```prisma
model User {
  id          Int    @id @default(autoincrement())
  username    String @unique
  // ...other fields
  categories  Category[]
}

model Category {
  id     Int    @id @default(autoincrement())
  name   String
  // ...other fields
  user   User   @relation(fields: [userId], references: [id])
  userId Int
}
```

2. After model changes, run:
```bash
npx prisma generate   # Update Prisma Client
npx prisma db push    # Update database schema
```

### 2. Service Implementation

#### Creating a New Module
1. Create module structure:
```
src/modules/your-feature/
├── dto/               # Data Transfer Objects
├── interface/         # TypeScript interfaces
├── your-feature.controller.ts
├── your-feature.service.ts
└── your-feature.module.ts
```

2. Define Module (`your-feature.module.ts`):
```typescript
@Module({
  controllers: [YourFeatureController],
  providers: [YourFeatureService],
  exports: [YourFeatureService], // if needed by other modules
})
export class YourFeatureModule {}
```

#### Database Operations (Service Layer)
Example from `categories.service.ts`:
```typescript
@Injectable()
export class YourFeatureService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.yourModel.findMany({
      // Add conditions, relations, etc.
    });
  }

  async create(data: CreateDto) {
    return await this.prisma.yourModel.create({
      data: {
        // your data structure
      },
    });
  }
}
```

#### API Endpoints (Controller Layer)
Example from `categories.controller.ts`:
```typescript
@Controller('your-feature')
export class YourFeatureController {
  constructor(private readonly service: YourFeatureService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiOkResponse({ type: YourResponseType })
  async getAll(): Promise<YourResponseType[]> {
    return await this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new item' })
  @UsePipes(new ZodValidationPipe(createSchema))
  async create(@Body() data: CreateDto): Promise<YourResponseType> {
    return await this.service.create(data);
  }
}
```

### 3. Data Validation

#### DTOs and Validation
1. Create DTO (Data Transfer Object) with Zod schema:
```typescript
// dto/create.dto.ts
export const createSchema = z.object({
  name: z.string()
    .nonempty()
    .transform(value => uppercaseFirstLetter(value.trim())),
  // other fields
});

export type CreateDto = z.infer<typeof createSchema>;
```

2. Apply validation in controller:
```typescript
@Post()
@UsePipes(new ZodValidationPipe(createSchema))
async create(@Body() data: CreateDto) {
  // data is validated
}
```

### 4. API Documentation

#### Swagger Documentation
1. Add decorators to your controller:
```typescript
@ApiOperation({ summary: 'Operation summary' })
@ApiOkResponse({ description: 'Success response', type: ResponseType })
@ApiBadRequestResponse({ description: 'Bad request', type: ExceptionDto })
```

2. Define interface for Swagger:
```typescript
export class IYourFeature {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  optionalField?: string;
}
```

### 5. Error Handling

The global exception filter (`AppExceptionsFilter`) automatically handles errors. In your services/controllers:

```typescript
if (!item) {
  throw new NotFoundException(messages.notFound('item'));
}
```

### 6. Integration Steps

1. Create your module files following the structure above
2. Add your module to `app.module.ts`:
```typescript
@Module({
  imports: [
    // ...existing imports
    YourFeatureModule,
  ],
})
```
3. Update Prisma schema if needed
4. Implement service methods
5. Create controller endpoints
6. Add Swagger documentation
7. Test your endpoints

## Best Practices

1. **Database Operations**
   - Always use Prisma service for database operations
   - Handle database errors appropriately
   - Use transactions for multiple operations

2. **API Design**
   - Use proper HTTP methods (GET, POST, PATCH, DELETE)
   - Implement proper validation using DTOs
   - Follow REST naming conventions

3. **Error Handling**
   - Use appropriate HTTP exceptions
   - Provide meaningful error messages
   - Handle edge cases

4. **Documentation**
   - Document all endpoints using Swagger decorators
   - Keep API documentation up to date
   - Include example requests/responses

## Development Workflow

1. Define new feature requirements
2. Update database schema if needed
3. Create/update DTOs and interfaces
4. Implement service methods
5. Create controller endpoints
6. Add validation and documentation
7. Test endpoints
8. Update API documentation

## Architecture

### Core Components

#### 1. Main Application (main.ts)
- Entry point of the application
- Configures global middleware, CORS, and API prefix
- Sets up Swagger documentation at `/docs` endpoint
- Initializes the application with proper configuration

#### 2. App Module (app.module.ts)
The root module that organizes the application structure:
- Global Modules:
  - ConfigModule: Manages environment configurations
  - ScheduleModule: Handles scheduled tasks
  - HttpModule: Manages HTTP requests
  - DatabaseModule: Handles database connections
- Feature Modules:
  - UsersModule: User management
  - CategoriesModule: Category management
- Global Providers:
  - Exception Filter: Global error handling
  - Interceptors: Response transformation and POST request handling
  - Logger Middleware: HTTP request logging

### Database Layer

#### Database Configuration (db.config.ts)
- Uses Prisma ORM for database operations
- PostgreSQL as the database provider
- Global PrismaService for database access across modules

#### Schema (prisma/schema.prisma)
Main entities:
1. User:
   - Basic user information (username, password, name, email)
   - One-to-many relationship with categories
2. Category:
   - Financial category information (name, image, limit)
   - Many-to-one relationship with users

### Middleware Layer

#### Logger Middleware
- Tracks HTTP requests and responses
- Logs request method, URL, status code, and response time
- Provides colored console output for different HTTP methods
- Logs payload for error responses

### Interceptors

#### 1. Transform Interceptor
- Standardizes API response format
- Wraps responses in a consistent structure:
```typescript
{
  data: T,
  message: string
}
```

#### 2. Post Interceptor
- Normalizes POST request responses
- Converts 201 Created status to 200 OK for consistency

### Exception Handling

#### App Exceptions Filter
- Global error handling mechanism
- Standardizes error responses
- Handles both HTTP and internal server errors
- Returns structured error responses:
```typescript
{
  statusCode: number,
  message: string
}
```

### Feature Modules

#### 1. Users Module
- Handles user management operations
- Components:
  - Controller: Routes user-related requests
  - Service: Implements user business logic
  - DTOs: Data transfer objects for user operations

#### 2. Categories Module
- Manages financial categories
- Components:
  - Controller: Handles category endpoints
  - Service: Implements category operations
  - DTOs & Interfaces: Defines data structures

### API Documentation

#### Swagger Setup
- Available at `/docs` endpoint
- Provides interactive API documentation
- Includes request/response schemas
- Supports API testing

### Utilities

#### Configuration
- Environment-based configuration
- Configurable settings:
  - Server port and host
  - Payload limits
  - Database connection
  - Environment mode (development/production)

#### Scheduler Service
- Handles periodic tasks
- Includes auto-ping functionality to prevent idle shutdown
- Configurable intervals for scheduled tasks

## API Structure

### Base URL
- All API routes are prefixed with `/api`
- Exception: Root path ("/") is excluded from prefix

### CORS Configuration
- Enabled for all origins ("*")
- Supports standard HTTP methods
- Allows common headers:
  - Content-Type
  - Accept
  - Authorization

## Development Guidelines

### Project Setup
```bash
npm install          # Install dependencies
npm run start:dev   # Run in development mode
npm run start:prod  # Run in production mode
```

### Testing
```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run test:cov    # Generate test coverage
```

### Best Practices
1. Use DTOs for data validation
2. Implement proper error handling
3. Follow NestJS module structure
4. Document API endpoints using Swagger decorators
5. Use dependency injection for services
6. Implement proper logging for debugging
7. Use environmental variables for configuration