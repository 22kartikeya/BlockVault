// prisma client
// first genarate the client therefore we have to migrate and hence first have to create database

import { PrismaClient } from '@prisma/client';

// here prisma client only runs once
const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// eslint-disable-next-line
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton(); // this line make sures that prisma client shoul only runs once

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// export const prismaClient = new PrismaClient();
// cannot be done like this due to re opening again and again
