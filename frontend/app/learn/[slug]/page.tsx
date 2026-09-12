import { notFound } from "next/navigation";
import { getPuzzle, puzzles } from "@/lib/puzzles";
import { Workspace } from "@/components/workspace";
export function generateStaticParams() {
  return puzzles.map((p) => ({ slug: p.slug }));
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const puzzle = getPuzzle(slug);
  if (!puzzle) notFound();
  return <Workspace puzzle={puzzle} />;
}
