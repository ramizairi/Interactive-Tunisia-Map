"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import type { PendingPlaceRequest } from "@/types/auth";

export function AdminModeration({ requests }: { requests: PendingPlaceRequest[] }) {
  const router = useRouter();
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function moderate(id: string, action: "approve" | "reject") {
    setError(null);
    setActiveRequest(`${action}:${id}`);

    try {
      const response = await fetch("/api/admin/places/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Could not moderate this place.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not moderate this place.");
    } finally {
      setActiveRequest(null);
    }
  }

  if (!requests.length) {
    return <p className="rounded-lg border border-dashed border-zinc-300 p-5 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-400">No pending place requests.</p>;
  }

  return (
    <div className="grid gap-3">
      {error ? (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm font-semibold text-orange-800 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-200">
          {error}
        </div>
      ) : null}
      {requests.map((request) => (
        <article key={request.id} className="rounded-lg border border-black/10 bg-white/84 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{request.name}</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {request.category} in {request.region} by @{request.submittedByUsername}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {request.coordinates[0]}, {request.coordinates[1]}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => moderate(request.id, "approve")}
                disabled={activeRequest !== null}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {activeRequest === `approve:${request.id}` ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Approve
              </button>
              <button
                type="button"
                onClick={() => moderate(request.id, "reject")}
                disabled={activeRequest !== null}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-700 px-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {activeRequest === `reject:${request.id}` ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                Reject
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
