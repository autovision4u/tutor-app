"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSession } from "@/lib/actions/sessions";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this session?")) return;
    setLoading(true);
    await deleteSession(sessionId);
    router.push("/sessions");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </>
      )}
    </Button>
  );
}
