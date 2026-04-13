"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSession } from "@/lib/actions/sessions";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(t("sessions.deleteConfirm"))) return;
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
          <Trash2 className="h-4 w-4 me-2" />
          {t("common.delete")}
        </>
      )}
    </Button>
  );
}
