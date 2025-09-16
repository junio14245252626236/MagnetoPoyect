import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company");
  if (!company) return NextResponse.json({ error: 'company is required' }, { status: 400 });

  const stats = await prisma.companyStats.findUnique({ where: { company } });
  const feedbacks = await prisma.chatMessage.findMany({ where: { feedback: true, thread: { job: { company } } } });
  const totalOpiniones = feedbacks.length;
  const ratings: number[] = feedbacks
    .map((f: { rating: number | null }) => f.rating as number | null)
    .filter((r: number | null): r is number => typeof r === 'number');
  const ratingPromedio = ratings.length ? Number((ratings.reduce((a:number,b:number)=>a+b,0) / ratings.length).toFixed(1)) : 0;

  return NextResponse.json({
    totalOpiniones,
    ratingPromedio,
    candidatosActivos: stats?.candidatesActive ?? 0,
    vistasEmpresa: stats?.companyViews ?? 0,
  });
}
