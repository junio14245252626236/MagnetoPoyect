import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function fetchAndExtract(url: string) {
  const res = await fetch(url, { cache: 'no-store' as any });
  const html = await res.text();
  // Very naive text extraction: remove scripts/styles and tags
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const text = noScript
    .replace(/<[^>]+>/g, ' ') // remove tags
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
  // Try to get title
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : undefined;
  return { title, text };
}

export async function POST() {
  const url = 'https://www.magneto365.com/es';
  const { title, text } = await fetchAndExtract(url);
  await prisma.pageContent.create({
    data: {
      source: 'magneto365',
      url,
      title,
      content: text,
    },
  });
  return NextResponse.json({ ok: true, title, length: text.length });
}
