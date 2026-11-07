# Library Management System API

## 1. Project Overview

The Library Management System API is a backend application developed using NestJS, TypeScript, Prisma ORM, and PostgreSQL.

The system provides functionality for managing books and their genres through RESTful API endpoints. It also includes database models for users and book reviews.

The project demonstrates database design, relational data management, CRUD operations, input validation, and error handling.

## 2. Technologies Used

- **Node.js** – JavaScript runtime.
- **NestJS** – Backend application framework.
- **TypeScript** – Programming language.
- **Prisma ORM** – Database access and management.
- **PostgreSQL** – Relational database.
- **class-validator** – Request data validation.
- **class-transformer** – Data transformation.
- **Postman** – API testing.
- **Git and GitHub** – Version control.

## 3. Features

- Create, retrieve, update, and delete books.
- Create, retrieve, update, and delete genres.
- Organize books by genre.
- Store book information, including title, author, ISBN, description, and publication year.
- Validate incoming API requests.
- Reject unexpected request properties.
- Handle missing database records.
- Prevent deletion of genres that contain books.
- Maintain relationships between users, books, genres, and reviews.

## 4. Project Structure

```text
api/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── books/
│   │   ├── dto/
│   │   │   ├── create-book.dto.ts
│   │   │   └── update-book.dto.ts
│   │   ├── books.controller.ts
│   │   ├── books.service.ts
│   │   └── books.module.ts
│   │
│   ├── genres/
│   │   ├── dto/
│   │   │   ├── create-genre.dto.ts
│   │   │   └── update-genre.dto.ts
│   │   ├── genres.controller.ts
│   │   ├── genres.service.ts
│   │   └── genres.module.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── generated/
│   │   └── prisma/
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── prisma.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 5. Installation and Setup

### Prerequisites

Ensure you have installed:

- Node.js
- npm
- PostgreSQL database
- Git

### Step 1: Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Navigate into the API directory

```bash
cd library-management-system/api
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Configure environment variables

Create a `.env` file in the API directory.

Add your PostgreSQL connection string:

```env
DATABASE_URL="your_postgresql_connection_string"
```

Replace the placeholder with your actual database connection string.

Never commit your real `.env` file or database credentials to GitHub.

### Step 5: Generate the Prisma Client

```bash
npx prisma generate
```

### Step 6: Apply database migrations

```bash
npx prisma migrate dev
```

### Step 7: Seed the database

```bash
npx prisma db seed
```

The seed script populates the database with sample genres and books.

## 6. Running the Application

Start the development server:

```bash
npm run start:dev
```

The API runs at:

```text
http://localhost:3000
```

## 7. API Endpoints

All endpoints use the base URL:

`http://localhost:3000`

### Books API

| Method | Endpoint   | Description              |
| ------ | ---------- | ------------------------ |
| GET    | /books     | Retrieve all books       |
| GET    | /books/:id | Retrieve a specific book |
| POST   | /books     | Create a new book        |
| PATCH  | /books/:id | Update a book            |
| DELETE | /books/:id | Delete a book            |

### Genres API

| Method | Endpoint    | Description               |
| ------ | ----------- | ------------------------- |
| GET    | /genres     | Retrieve all genres       |
| GET    | /genres/:id | Retrieve a specific genre |
| POST   | /genres     | Create a new genre        |
| PATCH  | /genres/:id | Update a genre            |
| DELETE | /genres/:id | Delete a genre            |

## 8. Database Schema

The database contains four main models:

### User

Stores information about library users.

Fields include:

- id
- name
- email
- role
- createdAt

The Role enum defines two user roles:

- PATRON
- LIBRARIAN

### Genre

Stores book categories.

Fields include:

- id
- name
- createdAt

Each genre can have multiple books.

### Book

Stores information about library books.

Fields include:

- id
- title
- author
- isbn
- description
- publishedYear
- genreId
- createdAt
- updatedAt

Each book belongs to one genre and can have multiple reviews.

### Review

Stores reviews submitted by users.

Fields include:

- id
- rating
- comment
- bookId
- userId
- createdAt

A composite unique constraint on `bookId` and `userId` ensures that a user can submit only one review per book.

## 9. Database Relationships

The system uses relational database relationships:

- **Genre to Book:** One-to-many. A genre can contain multiple books, while each book belongs to one genre.
- **Book to Review:** One-to-many. A book can have multiple reviews.
- **User to Review:** One-to-many. A user can write multiple reviews.

These relationships are implemented using Prisma relations and foreign keys.

## 10. Schema Decisions

### Why PostgreSQL?

PostgreSQL was selected because the application manages structured and interconnected data.

Its relational database capabilities provide:

- Data consistency through relational constraints.
- Support for primary and foreign keys.
- Unique constraints to prevent duplicate records.
- Reliable transactions.
- Efficient querying of related records.

A relational database is appropriate for a library system because books, genres, users, and reviews have clearly defined relationships.

### Why Prisma ORM?

Prisma was selected because it simplifies database interactions through a type-safe client.

Its advantages include:

- Type-safe database queries.
- Schema-based database modeling.
- Database migration management.
- Easier handling of relationships.
- Reduced need to write raw SQL queries.

### Why use CUID identifiers?

The models use CUIDs to generate unique identifiers for database records.

This avoids relying on sequential identifiers and provides unique IDs for books, genres, users, and reviews.

### Why use optional fields?

Some book information, such as description and publication year, may not always be available.

These fields are therefore optional, allowing the system to store books even when this information is missing.

## 11. Validation and Error Handling

The application uses `class-validator` and NestJS's global `ValidationPipe` to validate incoming requests.

Validation features include:

- Required fields cannot be empty.
- String fields must contain strings.
- Publication year must be a non-negative integer.
- Unexpected properties are rejected.
- Optional fields are validated when provided.

The API also handles common errors:

| Status Code | Meaning                                       |
| ----------- | --------------------------------------------- |
| 400         | Bad Request – Invalid input                   |
| 404         | Not Found – Requested record does not exist   |
| 409         | Conflict – Operation violates a database rule |
| 500         | Internal Server Error                         |

The application prevents deletion of a genre that still has books assigned to it.

## 12. Testing

The API was tested using Postman.

The following operations were verified:

- Retrieving books and genres.
- Creating books and genres.
- Updating books and genres.
- Deleting books and genres.
- Rejecting invalid request data.
- Rejecting unexpected properties.
- Handling missing records.
- Preventing deletion of genres containing books.

## 13. Build

To compile the application, run:

```bash
npm run build
```

## 14. Future Improvements

Potential improvements include:

- User registration and authentication.
- Role-based access control.
- Book review management endpoints.
- Search and filtering.
- Pagination.
- API documentation using Swagger.
- Automated unit and integration tests.

## 15. Author

Developed as a Library Management System backend project using NestJS, Prisma, and PostgreSQL.

## 16. License

This project is developed for educational purposes.
