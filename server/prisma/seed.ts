import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create 5 test users
  const users = [
    await prisma.user.create({
      data: {
        email: 'admin@mail.com',
        password: 'password123',
        name: 'Admin User',
      },
    }),
    await prisma.user.create({
      data: {
        email: 'user1@mail.com',
        password: 'password123',
        name: 'Test User 1',
      },
    }),
    await prisma.user.create({
      data: {
        email: 'user2@mail.com',
        password: 'password123',
        name: 'Test User 2',
      },
    }),
    await prisma.user.create({
      data: {
        email: 'user3@mail.com',
        password: 'password123',
        name: 'Test User 3',
      },
    }),
    await prisma.user.create({
      data: {
        email: 'user4@mail.com',
        password: 'password123',
        name: 'Test User 4',
      },
    }),
  ];

  // Create 50 invoices
  for (let i = 0; i < 50; i++) {
    await prisma.invoice.create({
      data: {
        vendor_name: faker.company.name(),
        amount: faker.number.float({ min: 100, max: 1000, fractionDigits: 2 }),
        due_date: faker.date.future(),
        description: faker.lorem.sentence(),
        user: {
          connect: { id: users[Math.floor(Math.random() * users.length)].id },
        },
        paid: faker.datatype.boolean(),
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
