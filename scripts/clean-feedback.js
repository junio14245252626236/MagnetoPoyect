const prisma = require("../lib/prisma.ts").default;

async function cleanFeedback() {
  try {
    // Eliminar todas las opiniones de feedback que no tienen company
    const deleted = await prisma.chatMessage.deleteMany({
      where: {
        feedback: true,
        company: null
      }
    });
    
    console.log(`🧹 ${deleted.count} opiniones sin empresa eliminadas`);
  } catch (error) {
    console.error('❌ Error limpiando feedback:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanFeedback();