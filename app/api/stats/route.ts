import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company");
  if (!company) return NextResponse.json({ error: 'company is required' }, { status: 400 });

  const stats = await prisma.companyStats.findUnique({ where: { company } });
  
  // Get all feedback for the company (both with company field and legacy data)
  const feedbacks = await prisma.$queryRaw`
    SELECT rating FROM ChatMessage 
    WHERE feedback = 1 AND (company = ${company} OR company IS NULL)
  `;
  
  const totalOpiniones = Array.isArray(feedbacks) ? feedbacks.length : 0;
  const ratings: number[] = Array.isArray(feedbacks) 
    ? feedbacks
        .map((f: any) => f.rating)
        .filter((r: any): r is number => typeof r === 'number' && r > 0)
    : [];
  const ratingPromedio = ratings.length ? Number((ratings.reduce((a:number,b:number)=>a+b,0) / ratings.length).toFixed(1)) : 0;

  return NextResponse.json({
    totalOpiniones,
    ratingPromedio,
    candidatosActivos: stats?.candidatesActive ?? 0,
    vistasEmpresa: stats?.companyViews ?? 0,
  });
}
