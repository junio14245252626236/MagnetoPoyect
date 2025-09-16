import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  // Get feedback messages, optionally filtered by company
  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company");
  const feedbacks = await prisma.chatMessage.findMany({
    where: {
      feedback: true,
      thread: company
        ? {
            job: { company: { equals: company } },
          }
        : undefined,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      threadId: true,
      text: true,
      createdAt: true,
      rating: true,
      thread: { select: { job: { select: { company: true, title: true } } } },
    },
  });
  return NextResponse.json({ feedbacks });
}
