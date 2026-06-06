"use client";

import { useState } from "react";
import { buttonStyles } from "@/lib/ui";

type CopyReportButtonProps = {
  reportBody: string;
};

export default function CopyReportButton({
  reportBody,
}: CopyReportButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(reportBody);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      alert("Copy failed. Please select the report text manually.");
    }
  }

  return (
    <button type="button" onClick={handleCopy} className={buttonStyles.primary}>
      {copied ? "Copied!" : "Copy Report"}
    </button>
  );
}