"use client";

import { useParams } from "next/navigation";
import { PadEditor } from "./PadEditor";

export function PadPageClient() {
  const { slug } = useParams<{ slug: string }>();
  return <PadEditor slug={slug} />;
}
