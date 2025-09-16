import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { company = 'EAFIT', total = 156 } = await request.json().catch(() => ({}));

  // Ensure stats
  await prisma.companyStats.upsert({
    where: { company },
    update: { candidatesActive: 2847, companyViews: 15420 },
    create: { company, candidatesActive: 2847, companyViews: 15420 },
  });

  // Get or create a thread for company feedback
  const anyJob = await prisma.job.findFirst({ where: { company } });
  const thread = await prisma.chatThread.create({ data: { jobId: anyJob?.id } });

  // Create feedbacks with ~4.3 average rating
  const texts = [
    "Excelente ambiente laboral, muchas oportunidades de crecimiento.",
    "Buenos beneficios y flexibilidad horaria.",
    "La empresa se preocupa por el bienestar de los empleados.",
    "Proyectos interesantes y tecnologías modernas.",
    "Buena cultura organizacional y liderazgo.",
  ];

  const messages = Array.from({ length: total }).map((_, i) => ({
    threadId: thread.id,
    sender: 'user' as const,
    text: texts[i % texts.length],
    feedback: true,
    rating: ((i * 7) % 10) < 2 ? 3 : ((i * 5) % 10) < 4 ? 4 : 5, // Distribuir 3,4,5 para promedio ~4.3
  }));

  await prisma.chatMessage.createMany({ data: messages });

  return NextResponse.json({ seeded: true, count: messages.length });
}
