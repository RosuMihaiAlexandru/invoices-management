import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create 5 test users
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      },
    });
    users.push(user);
  }

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
