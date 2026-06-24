import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MATCHLY_API_BASE } from "@/lib/matchly-api";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Als Serviceanbieter registrieren — Nearfix" },
      {
        name: "description",
        content:
          "Registriere dich als Serviceanbieter bei Nearfix und erreiche Familien, die genau deinen Service suchen.",
      },
    ],
  }),
  component: RegisterPage,
});

const SERVICES = ["Klempner", "Elektriker", "Maler", "Schlosser", "Heizung", "Sonstiges"];

function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    city: "",
    notes: "",
  });

  const update = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.city.trim()
    ) {
      toast.error("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        tags: form.service,
        status: "active",
        notes: form.notes.trim(),
        organization: { city: form.city.trim() },
      };
      const res = await fetch(`${MATCHLY_API_BASE}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      setDone(true);
      toast.success("Danke! Wir melden uns bald.");
    } catch {
      toast.error("Registrierung fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Startseite
          </Link>
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--gradient-primary)] text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            Nearfix
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12 md:py-20">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Für Serviceanbieter
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Werde Teil von{" "}
            <span className="bg-[var(--gradient-primary)] bg-clip-text text-transparent">
              Nearfix
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Trage dich kostenlos ein und erreiche Familien, die genau deinen
            Service suchen.
          </p>
        </div>

        {done ? (
          <Card className="border-border bg-card shadow-[var(--shadow-soft)]">
            <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Danke! Wir melden uns bald.
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Wir prüfen deine Angaben und nehmen in Kürze Kontakt mit dir auf.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/">Zurück zur Startseite</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border bg-card shadow-[var(--shadow-soft)]">
            <CardHeader className="border-b border-border bg-muted/30">
              <CardTitle className="text-base font-semibold">Deine Angaben</CardTitle>
              <CardDescription className="text-sm">
                Pflichtfelder sind mit * markiert.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Vorname *</Label>
                    <Input
                      id="firstName"
                      required
                      maxLength={100}
                      value={form.firstName}
                      onChange={(e) => update("firstName")(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nachname *</Label>
                    <Input
                      id="lastName"
                      required
                      maxLength={100}
                      value={form.lastName}
                      onChange={(e) => update("lastName")(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      maxLength={255}
                      value={form.email}
                      onChange={(e) => update("email")(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      maxLength={30}
                      value={form.phone}
                      onChange={(e) => update("phone")(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="service">Serviceart</Label>
                    <Select value={form.service} onValueChange={update("service")}>
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Auswählen…" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Stadt *</Label>
                    <Input
                      id="city"
                      required
                      maxLength={100}
                      value={form.city}
                      onChange={(e) => update("city")(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Kurze Beschreibung</Label>
                  <Textarea
                    id="notes"
                    rows={4}
                    maxLength={1000}
                    placeholder="Erzähle uns kurz, was dich auszeichnet…"
                    value={form.notes}
                    onChange={(e) => update("notes")(e.target.value)}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full rounded-xl" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Wird gesendet…
                    </>
                  ) : (
                    "Jetzt registrieren"
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Kostenlos · Keine Verpflichtung
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
