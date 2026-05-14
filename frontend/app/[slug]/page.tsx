import { PadPageClient } from "./PadPageClient";

export function generateStaticParams() {
  return [{ slug: "_" }];
}

export default function Page() {
  return <PadPageClient />;
}
