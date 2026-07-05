import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "../src/config/index.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const main = async () => {
  const hashedPassword = await bcrypt.hash(config.admin.password, 12);

  const admin = await prisma.user.upsert({
    where: {
      email: config.admin.email,
    },
    update: {},
    create: {
      name: "RentNest Admin",
      email: config.admin.email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log(`Admin ready: ${admin.email}`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });