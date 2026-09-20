import { notFound } from "next/navigation";
import { codingProblems, getCodingProblem } from "@/lib/coding-problems";
import { CodingWorkspace } from "@/components/coding-workspace";
export function generateStaticParams() { return codingProblems.map(problem=>({slug:problem.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const problem=getCodingProblem((await params).slug); return {title:problem?`${problem.title} | socratescode`:"Problem not found | socratescode"}; }
export default async function SolvePage({params}:{params:Promise<{slug:string}>}) { const problem=getCodingProblem((await params).slug); if(!problem)notFound(); return <CodingWorkspace key={problem.slug} problem={problem}/>; }
