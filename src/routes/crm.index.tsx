import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Mail, Phone, ArrowLeft, Loader2, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchContacts, primaryService, type ApiContact } from "@/lib/matchly-api";

export const Route = createFileRoute("/crm/")({
  head: () => ({
    meta: [
      { title: "CRM — Matchly" },
      { name: "description", content: "Manage your service provider contacts on Matchly." },
    ],
  }),
  component: CrmPage,
});

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant="secondary"
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active
          ? "bg-primary/10 text-primary hover:bg-primary/15"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      <span
        className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
          active ? "bg-primary" : "bg-muted-foreground/60"
        }`}
      />
      {active ? "Aktiv" : "Inaktiv"}
    </Badge>
  );
}

function ServiceBadge({ type }: { type: string }) {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/10"
    >
      {type}
    </Badge>
  );
}

function CrmPage() {
  const [contacts, setContacts] = useState<ApiContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    fetchContacts(ctrl.signal)
      .then((data) => setContacts(data))
      .catch((e) => {
        if (e.name !== "AbortError") setError("Backend nicht erreichbar. Bitte später erneut versuchen.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

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
          <span className="text-sm font-semibold text-foreground">Matchly CRM</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Serviceanbieter
              </h1>
              <p className="text-sm text-muted-foreground">
                Übersicht aller Kontakte und ihrer Verfügbarkeit.
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link to="/crm/new-contact">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Neuer Kontakt</span>
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden border-border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-5">
            <CardTitle className="text-base font-semibold">Kontaktliste</CardTitle>
            <CardDescription className="text-sm">
              {loading ? "Lade Kontakte…" : `${contacts.length} Kontakte gesamt`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Lade Kontakte…
              </div>
            ) : error ? (
              <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            ) : contacts.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                Keine Kontakte gefunden.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[200px] px-6 py-4 font-medium text-foreground">Name</TableHead>
                    <TableHead className="px-6 py-4 font-medium text-foreground">Kontakt</TableHead>
                    <TableHead className="px-6 py-4 font-medium text-foreground">Service</TableHead>
                    <TableHead className="px-6 py-4 font-medium text-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id} className="group">
                      <TableCell className="px-6 py-4">
                        <div className="font-medium text-foreground">
                          {contact.firstName} {contact.lastName}
                        </div>
                        {contact.organization?.name && (
                          <div className="text-xs text-muted-foreground">
                            {contact.organization.name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm">
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            {contact.email}
                          </a>
                          <a
                            href={`tel:${contact.phone.replace(/\s/g, "")}`}
                            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {contact.phone}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <ServiceBadge type={primaryService(contact)} />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <StatusBadge active={contact.status === "active"} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
