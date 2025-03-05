# Invoices Management

This is a full-stack invoices management application built with Nest.js for the Sever and React with Vite for the client. The application utilizes Prisma as an ORM for PostgreSQL and runs the database inside a Docker container.

## Technologies Used

### Sever:
- **Nest.js** - A progressive Node.js framework
- **Prisma** - ORM for PostgreSQL
- **Docker** - Containerized PostgreSQL database
- **Jest/Vitest** - For testing

### client:
- **React** - UI framework
- **Vite** - Fast build tool for React

## Getting Started

### Sever Setup
1. Navigate to the Sever directory:
   ```sh
   cd sever
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start PostgreSQL using Docker:
   ```sh
   docker-compose up -d
   ```
4. Run database migrations:
   ```sh
   npx prisma migrate dev
   ```
5. Seed the database with test data:
   ```sh
   npm run seed
   ```
6. Start the Sever server:
   ```sh
   npm run start:dev
   ```

### Front-end Setup
1. Navigate to the client directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the client application:
   ```sh
   npm run dev
   ```

## Test User Accounts
After running the seed command, you can log in using these test credentials:

| Email            | Password    | Role  |
|-----------------|------------|------|
| admin@mail.com  | password123 | Admin |
| user1@mail.com  | password123 | User  |
| user2@mail.com  | password123 | User  |
| user3@mail.com  | password123 | User  |
| user4@mail.com  | password123 | User  |

## License
This project is licensed under the **MIT License**.

## 🤝 Contributing
Contributions are welcome! Please create an issue or pull request if you have suggestions or improvements.

---

📌 **Maintained by** [Rosu Mihai Alexandru](https://github.com/RosuMihaiAlexandru)

