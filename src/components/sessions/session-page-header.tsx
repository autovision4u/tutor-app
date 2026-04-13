"use client";

import { useTranslation } from "@/lib/i18n/context";
import { CardHeader, CardTitle } from "@/components/ui/card";

export function SessionPageHeader({
  type,
  deleteButton,
}: {
  type: "create" | "edit";
  deleteButton?: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <CardHeader className={deleteButton ? "flex flex-row items-center justify-between" : ""}>
      <CardTitle>
        {type === "create" ? t("sessions.createSession") : t("sessions.editSession")}
      </CardTitle>
      {deleteButton}
    </CardHeader>
  );
}
