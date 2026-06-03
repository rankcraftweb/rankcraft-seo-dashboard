"use client";

import { useState } from "react";

type CopyReportButtonProps = {
  reportBody: string;
};

export default function CopyReportButton({
  reportBody,
}: CopyReportButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(reportBody);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
    >
      {copied ? "Copied!" : "Copy Report"}
    </button>
  );
}