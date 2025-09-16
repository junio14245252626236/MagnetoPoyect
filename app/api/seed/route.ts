import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  const count = await prisma.job.count();
  if (count > 0) return NextResponse.json({ seeded: false, message: "Jobs already exist" });

  await prisma.job.createMany({
    data: [
      { title: "Desarrollador Frontend", company: "Magneto365", location: "Remoto", description: "React/Next.js, Tailwind, TypeScript" },
      { title: "Data Analyst", company: "TechCorp", location: "Bogotá", description: "SQL, BI, dashboards" },
      { title: "QA Engineer", company: "StartupX", location: "Medellín", description: "Testing automation, CI/CD" },
    ],
  });
  return NextResponse.json({ seeded: true });
}
