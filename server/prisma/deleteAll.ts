import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllRecords() {
  await prisma.invoice.deleteMany({});
  await prisma.user.deleteMany({});
}

deleteAllRecords()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
