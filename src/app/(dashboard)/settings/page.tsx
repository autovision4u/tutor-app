import { getSettings } from "@/lib/actions/settings";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-2xl mx-auto">
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
