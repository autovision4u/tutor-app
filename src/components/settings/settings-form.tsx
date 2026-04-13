"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { updateSettings, type BusinessSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, Settings, AlertCircle } from "lucide-react";

export function SettingsForm({ initialSettings }: { initialSettings: BusinessSettings }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [businessName, setBusinessName] = useState(initialSettings.business_name);
  const [ownerName, setOwnerName] = useState(initialSettings.owner_name);
  const [phone, setPhone] = useState(initialSettings.phone);
  const [email, setEmail] = useState(initialSettings.email);
  const [hourlyRate, setHourlyRate] = useState(String(initialSettings.hourly_rate));
  const [notes, setNotes] = useState(initialSettings.notes);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);

    try {
      await updateSettings({
        business_name: businessName,
        owner_name: ownerName,
        phone,
        email,
        hourly_rate: Number(hourlyRate) || 0,
        notes,
      });
      setSaved(true);
      router.refresh();
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("settings.title")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t("settings.businessInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">{t("settings.businessName")}</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => { setBusinessName(e.target.value); setSaved(false); }}
                  placeholder={t("settings.businessNamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerName">{t("settings.ownerName")}</Label>
                <Input
                  id="ownerName"
                  value={ownerName}
                  onChange={(e) => { setOwnerName(e.target.value); setSaved(false); }}
                  placeholder={t("settings.ownerNamePlaceholder")}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settingsPhone">{t("settings.phone")}</Label>
                <Input
                  id="settingsPhone"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setSaved(false); }}
                  placeholder="050-1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settingsEmail">{t("settings.email")}</Label>
                <Input
                  id="settingsEmail"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSaved(false); }}
                  placeholder="tutor@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">{t("settings.hourlyRate")}</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="10"
                value={hourlyRate}
                onChange={(e) => { setHourlyRate(e.target.value); setSaved(false); }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settingsNotes">{t("settings.notes")}</Label>
              <Textarea
                id="settingsNotes"
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
                placeholder={t("settings.notesPlaceholder")}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    {t("common.saving")}
                  </>
                ) : (
                  t("settings.save")
                )}
              </Button>
              {saved && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  {t("settings.saved")}
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
