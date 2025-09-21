const prisma = require("../lib/prisma.ts").default;

async function main() {
  const companyName = 'EAFIT';
  const total = 50;

  // Ensure stats
  await prisma.companyStats.upsert({
    where: { company: companyName },
    update: { candidatesActive: 2847, companyViews: 15420 },
    create: { company: companyName, candidatesActive: 2847, companyViews: 15420 },
  });

  // Get or create a job for the company
  let job = await prisma.job.findFirst({ where: { company: companyName } });
  if (!job) {
    job = await prisma.job.create({
      data: {
        title: "Desarrollador Frontend",
        company: companyName,
        location: "Medellín",
        description: "Desarrollo de aplicaciones web con React y Next.js"
      }
    });
  }

  // Get or create a thread for company feedback
  const thread = await prisma.chatThread.create({ 
    data: { jobId: job.id } 
  });

  // Create feedbacks with ratings
  const feedbackTexts = [
    "Opino que el ambiente laboral es excelente, muchas oportunidades de crecimiento.",
    "Me parece que los beneficios son muy buenos y la flexibilidad horaria es perfecta.",
    "Sugerencia: la empresa se preocupa mucho por el bienestar de los empleados.",
    "Recomiendo trabajar aquí, proyectos interesantes y tecnologías modernas.",
    "Me gustó la cultura organizacional y el liderazgo es muy bueno.",
    "Opino que el proceso de selección fue transparente y profesional.",
    "Me parece que hay mucho apoyo para el desarrollo profesional.",
    "Sugerencia: podrían mejorar la comunicación entre departamentos.",
    "Recomiendo esta empresa por su enfoque en la innovación.",
    "Me gustó el equilibrio trabajo-vida personal que ofrecen.",
    "Opino que el salario es competitivo para el mercado.",
    "Me parece que las oficinas son modernas y cómodas.",
    "Sugerencia: excelente equipo de trabajo y colaboración.",
    "Recomiendo por las oportunidades de capacitación constante.",
    "Me gustó la diversidad e inclusión en el equipo."
  ];

  const messages = [];
  for (let i = 0; i < total; i++) {
    const text = feedbackTexts[i % feedbackTexts.length];
    const rating = Math.floor(Math.random() * 2) + 4; // Rating entre 4 y 5
    
    messages.push({
      threadId: thread.id,
      sender: 'user',
      text: text,
      feedback: true,
      rating: rating,
      company: companyName, // ¡Agregar el campo company!
    });
  }

  await prisma.chatMessage.createMany({ data: messages });

  console.log(`✅ ${total} opiniones creadas para ${companyName}`);
  console.log(`📊 Estadísticas actualizadas`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });