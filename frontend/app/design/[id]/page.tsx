import { notFound } from "next/navigation";
import { designChallenges } from "@/lib/design-challenges";
import { DesignWorkspace } from "@/components/design-studio";
export function generateStaticParams() { return designChallenges.map(item=>({id:item.id})); }
export default async function Page({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const selected=designChallenges.find(item=>item.id===id);
  if(!selected)notFound();
  return <DesignWorkspace key={selected.id} challenge={selected}/>;
}
