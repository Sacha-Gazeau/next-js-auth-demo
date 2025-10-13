import bcrypt from "bcrypt";
import { PrismaClient } from "../src/app/_generated/prisma";
async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}
const prisma = new PrismaClient();
async function main() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.create({
    data: {
      email: "karel.desmet@arteveldehs.be",
      name: "Karel De Smet",
      hashedPassword: await hashPassword("test"),
      posts: {
        create: [
          { title: "Prisma Day 2020" },
          { title: "How to write a Prisma schema" },
        ],
      },
    },
  });
  await prisma.user.create({
    data: {
      email: "john.doe@something.com",
      name: "John Doe",
      hashedPassword: await hashPassword("test"),
      posts: {
        create: [
          { title: "How to remain completely anonymous" },
          { title: "How I met Jane Doe" },
        ],
      },
    },
  });
  const postCount = await prisma.post.count();
  const userCount = await prisma.user.count();
  console.log({ postCount, userCount });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
