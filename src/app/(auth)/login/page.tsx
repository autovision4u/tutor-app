"use client";

import { useState } from "react";
import { login } from "@/lib/actions/auth";
import { useTranslation } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login({ email, password });
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <Sparkles
              className="text-purple-300/40"
              size={Math.random() * 20 + 10}
            />
          </div>
        ))}
      </div>

      <div className="absolute top-4 end-4 z-10">
        <LanguageSwitcher compact />
      </div>

      <Card className="w-full max-w-md relative z-10 animate-[scale-in_0.4s_cubic-bezier(0.4,0,0.2,1)]">
        <CardHeader className="text-center space-y-3">
          <div className="relative mx-auto">
            <div
              className="absolute inset-0 rounded-2xl blur-2xl opacity-60"
              style={{
                background: "linear-gradient(135deg, oklch(0.7 0.2 290), oklch(0.7 0.2 330))",
              }}
            />
            <div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
              style={{
                background: "linear-gradient(135deg, oklch(0.6 0.2 290), oklch(0.55 0.22 320))",
                boxShadow: "0 10px 30px oklch(0.55 0.2 290 / 0.4)",
                animation: "float-up 3s ease-in-out infinite",
              }}
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold gradient-text">
            {t("login.title")}
          </CardTitle>
          <CardDescription className="text-base">{t("login.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 animate-[fade-up_0.3s_ease-out]">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="tutor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="ms-2 h-4 w-4 animate-spin" />
                  {t("login.loading")}
                </>
              ) : (
                t("login.submit")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
