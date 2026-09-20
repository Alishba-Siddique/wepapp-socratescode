import { notFound } from "next/navigation";
import { patterns } from "@/lib/patterns";
import { getProductLesson } from "@/lib/product-lessons";
import { PatternLesson } from "@/components/pattern-lesson";
export function generateStaticParams() { return patterns.map(pattern => ({ id: pattern.id })); }
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pattern = patterns.find(item => item.id === id);
  const lesson = getProductLesson(id);
  if (!pattern || !lesson) notFound();
  return <PatternLesson key={id} title={pattern.title} lesson={lesson}/>;
}
