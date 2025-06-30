import { PrismaClient, Role, Status } from '@prisma/client';
// const { PrismaClient, Role, Status } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.expense.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashedpassword', // in real app, hash passwords
      role: Role.admin,
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: 'Employee User',
      email: 'employee@example.com',
      password: 'hashedpassword',
      role: Role.employee,
    },
  });

  // Create expenses for employee
  await prisma.expense.createMany({
    data: [
      {
        userId: employee.id,
        amount: 45.5,
        category: 'Food',
        description: 'Lunch with client',
        date: new Date('2025-06-15'),
        status: Status.approved,
      },
      {
        userId: employee.id,
        amount: 120,
        category: 'Travel',
        description: 'Taxi fare',
        date: new Date('2025-06-16'),
        status: Status.pending,
      },
    ],
  });

  console.log('Seed data created');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
