"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getPad, setPad } from "@/app/_lib/pads";

type SaveState = "idle" | "saving" | "saved" | "rate-limited";

export function PadEditor({ slug }: { slug: string }) {
  const [content, setContent] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    getPad(slug).then(setContent);
  }, [slug]);

  function handleChange(value: string) {
    setContent(value);
    setSaveState("idle");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setSaveState("saving");
      try {
        await setPad(slug, value);
        setSaveState("saved");
      } catch (err) {
        if (err instanceof Error && err.message === "rate limit exceeded") {
          setSaveState("rate-limited");
        } else {
          setSaveState("idle");
        }
      }
    }, 800);
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          dopad
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-zinc-500">/{slug}</span>
          <span className="text-xs text-zinc-400">
            {saveState === "saving" && "saving…"}
            {saveState === "saved" && "saved"}
            {saveState === "rate-limited" && (
              <span className="text-amber-500">slow down — rate limited</span>
            )}
          </span>
        </div>
      </header>
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start writing…"
        className="flex-1 w-full p-4 resize-none bg-white dark:bg-black text-sm font-mono outline-none"
      />
    </div>
  );
}
