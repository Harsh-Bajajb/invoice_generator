const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  const email = 'admin@example.com';
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: passwordHash,
    },
    create: {
      email,
      name: 'Admin User',
      password: passwordHash,
      role: 'admin',
    },
  });
  
  console.log(`\n✅ Seeded user successfully!`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding user:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
