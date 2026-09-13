import type { Metadata } from "next";
import { PatternLibrary } from "@/components/pattern-library";

export const metadata: Metadata = { title: "Pattern library | socratescode" };
export default function PatternsPage() {
  return <PatternLibrary />;
}
