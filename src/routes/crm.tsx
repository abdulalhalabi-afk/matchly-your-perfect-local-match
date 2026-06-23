import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Users, Mail, Phone, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: "CRM — Matchly" },
      { name: "description", content: "Manage your service provider contacts on Matchly." },
      { property: "og:title", content: "CRM — Matchly" },
      { property: "og:description", content: "Service provider contact management for Matchly." },
    ],
  }),
  component: CrmPage,
});

type ContactStatus = "Aktiv" | "Inaktiv";

interface ServiceContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType: string;
  status: ContactStatus;
}

const contacts: ServiceContact[] = [
  {
    id: "1",
    firstName: "Luc",
    lastName: "Dupont",
    email: "luc.dupont@example.com",
    phone: "+32 471 12 34 56",
    serviceType: "Klempner",
    status: "Aktiv",
  },
  {
    id: "2",
    firstName: "Elise",
    lastName: "Vermeulen",
    email: "elise.vermeulen@example.com",
    phone: "+32 472 23 45 67",
    serviceType: "Elektriker",
    status: "Aktiv",
  },
  {
    id: "3",
    firstName: "Mauro",
    lastName: "De Smet",
    email: "mauro.desmet@example.com",
    phone: "+32 473 34 56 78",
    serviceType: "Heizung",
    status: "Inaktiv",
  },
];

function StatusBadge({ status }: { status: ContactStatus }) {
  const isActive = status === "Aktiv";
  return (
    <Badge
      variant="secondary"
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-primary/10 text-primary hover:bg-primary/15"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      <span
        className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-primary" : "bg-muted-foreground/60"
        }`}
      />
      {status}
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
        <div className="mb-8 flex items-center gap-3">
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

        <Card className="overflow-hidden border-border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-5">
            <CardTitle className="text-base font-semibold">Kontaktliste</CardTitle>
            <CardDescription className="text-sm">
              {contacts.length} Kontakte gesamt
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px] px-6 py-4 font-medium text-foreground">
                    Name
                  </TableHead>
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
                      <ServiceBadge type={contact.serviceType} />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <StatusBadge status={contact.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
