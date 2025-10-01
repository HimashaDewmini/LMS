// createAdmin.js
const { PrismaClient } = require('./generated/prisma'); // ✅ updated path to generated client
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'himashadewmini12345@gmail.com';  // 🔹 change this
  const name = 'Super Admin';             // 🔹 change this
  const password = 'Hurathal1#';          // 🔹 change this
  const role = 'admin';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({ where: { email } });

  if (existingAdmin) {
    // If existing admin already has same role, skip password update
    if (existingAdmin.role === role && existingAdmin.name === name) {
      console.log('✅ Admin already exists with the same credentials. No changes made:', existingAdmin.email);
    } else {
      // Hash password only if update is needed
      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedAdmin = await prisma.user.update({
        where: { email },
        data: {
          name,
          password: hashedPassword,
          role,
        },
      });
      console.log('✅ Admin updated:', updatedAdmin);
    }
  } else {
    // Hash password and create new admin
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    console.log('✅ Admin created:', admin);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
