"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteWorkerButton({ workerId, workerName }: { workerId: string; workerName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/workers/${workerId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      setLoading(false);
      setConfirming(false);
      alert("Failed to delete worker.");
    }
  }

  if (confirming) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
          Delete {workerName}?
        </span>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: "4px 10px",
            border: "none",
            borderRadius: "var(--radius)",
            background: "var(--color-danger)",
            color: "white",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "opacity var(--transition)",
          }}
        >
          {loading ? "…" : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          style={{
            padding: "4px 10px",
            border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius)",
            background: "white",
            color: "var(--color-text-muted)",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "border-color var(--transition)",
          }}
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={`Delete ${workerName}`}
      style={{
        padding: "6px 8px",
        border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius)",
        background: "white",
        color: "var(--color-text-muted)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all var(--transition)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-danger)";
        (e.currentTarget as HTMLElement).style.color = "var(--color-danger)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
        (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    </button>
  );
}
