import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { askCopilot } from "@/lib/copilot";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session as any)?.user?.id as string | undefined;

  const { text, threadId, jobId, rating } = await request.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    let thread;
    if (threadId) {
      thread = await prisma.chatThread.findUnique({ where: { id: threadId } });
    }
    if (!thread) {
      thread = await prisma.chatThread.create({ data: { userId, jobId, title: undefined } });
    }

    // Detect feedback/opinion (simple heuristic: contains "opino", "me parece", "no me gustó", "me gustó", "sugerencia")
    const feedbackKeywords = ["opino", "me parece", "no me gustó", "me gustó", "sugerencia", "recomiendo", "no recomiendo"];
    const isFeedback = feedbackKeywords.some(k => text.toLowerCase().includes(k));
    const userMsg = await prisma.chatMessage.create({
      data: { threadId: thread.id, sender: "user", text, feedback: isFeedback, rating: isFeedback && rating ? rating : undefined },
    });

    // TODO: Replace with real Copilot API call
    let reply: string | null = null;
  let job = null as null | { title: string; company: string | null; location: string | null };
    if (jobId) {
      const j = await prisma.job.findUnique({ where: { id: jobId } });
      if (j) job = { title: j.title, company: j.company, location: j.location ?? null };
    }
    // Contextual job search: if user asks about empleos, answer from DB
    const lowerText = text.toLowerCase();
    if (lowerText.includes("empleo") || lowerText.includes("trabajo") || lowerText.includes("vacante")) {
      const jobs = await prisma.job.findMany();
      if (jobs.length === 0) {
        reply = "Actualmente no hay empleos disponibles en Magneto Empleo. ¿Quieres dejar tu feedback o sugerencia?";
      } else {
        reply = `Sí, hay ${jobs.length} empleos publicados. Ejemplo: ${jobs[0].title} en ${jobs[0].company}. ¿Te gustaría ver más detalles o dejar tu opinión?`;
      }
    }
    if (!reply) {
      // Pull a small slice of page content to use as extra context
      const page = await prisma.pageContent.findFirst({ where: { source: 'magneto365' }, orderBy: { createdAt: 'desc' } });
      const ctxSnippet = page ? page.content.slice(0, 1500) : undefined;
      const prompt = ctxSnippet ? `${ctxSnippet}\n\nUsuario: ${text}` : text;
      reply = await askCopilot(prompt, job ? { jobTitle: job.title, company: job.company ?? undefined, location: job.location ?? undefined } : undefined);
      if (!reply) reply = await generateBotReply(text, jobId);
    }

    const botMsg = await prisma.chatMessage.create({
      data: { threadId: thread.id, sender: "bot", text: reply },
    });

    return NextResponse.json({ threadId: thread.id, messages: [userMsg, botMsg] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function generateBotReply(userText: string, jobId?: string) {
  // Very simple heuristic reply, to be replaced by Copilot API integration
  const preamble = jobId ? `Sobre el empleo (${jobId}): ` : "";
  const lower = userText.toLowerCase();
  if (lower.includes("salario")) return preamble + "El salario depende del cargo y la experiencia. ¿Qué rango te interesa?";
  if (lower.includes("requisitos")) return preamble + "Los requisitos varían por oferta. ¿Qué empleo te interesa?";
  return preamble + "Gracias por tu mensaje. ¿Deseas más detalles de alguna vacante específica?";
}
