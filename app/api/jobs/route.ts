import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, company, location, description } = body;
  if (!title || !company || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const job = await prisma.job.create({ data: { title, company, location, description } });
  return NextResponse.json({ job }, { status: 201 });
}
