"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// const { PrismaClient, Role, Status } = require('@prisma/client');
const prisma = new client_1.PrismaClient();
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
            role: client_1.Role.admin,
        },
    });
    const employee = await prisma.user.create({
        data: {
            name: 'Employee User',
            email: 'employee@example.com',
            password: 'hashedpassword',
            role: client_1.Role.employee,
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
                status: client_1.Status.approved,
            },
            {
                userId: employee.id,
                amount: 120,
                category: 'Travel',
                description: 'Taxi fare',
                date: new Date('2025-06-16'),
                status: client_1.Status.pending,
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
