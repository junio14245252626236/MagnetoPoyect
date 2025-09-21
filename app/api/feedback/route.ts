import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  // Get feedback messages, optionally filtered by company
  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company");
  
  // Use raw query to get all feedback messages
  let feedbacks;
  if (company) {
    // Get feedback for specific company OR feedback without company (legacy data)
    feedbacks = await prisma.$queryRaw`
      SELECT 
        id,
        threadId,
        text,
        createdAt,
        rating,
        company
      FROM ChatMessage 
      WHERE feedback = 1 AND (company = ${company} OR company IS NULL)
      ORDER BY createdAt DESC
    `;
  } else {
    feedbacks = await prisma.$queryRaw`
      SELECT 
        id,
        threadId,
        text,
        createdAt,
        rating,
        company
      FROM ChatMessage 
      WHERE feedback = 1
      ORDER BY createdAt DESC
    `;
  }
  
  return NextResponse.json({ feedbacks });
}
