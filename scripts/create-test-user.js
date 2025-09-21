const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestUser() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  try {
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        name: 'Usuario Test',
        passwordHash: hashedPassword
      }
    });
    console.log('✅ Usuario de prueba creado:', user.email);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️ Usuario de prueba ya existe');
    } else {
      console.error('❌ Error creando usuario:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();