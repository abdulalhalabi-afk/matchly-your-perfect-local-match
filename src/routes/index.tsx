import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  Wrench,
  Sparkle,
  Zap,
  Baby,
  GraduationCap,
  Hammer,
  Layers,
  Target,
  UserCheck,
  ArrowRight,
  Check,
  Star,
  MapPin,
  MessageSquare,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchContacts,
  matchesSearch,
  primaryService,
  type ApiContact,
} from "@/lib/matchly-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matchly — The best local services for your family" },
      {
        name: "description",
        content:
          "Matchly is an AI agent that learns your preferences and recommends local service providers that actually match your family's needs.",
      },
      { property: "og:title", content: "Matchly — Local services that actually fit you" },
      {
        property: "og:description",
        content:
          "Not the best plumber in town. The best plumber for you. Personal AI recommendations for local services.",
      },
    ],
  }),
  component: Landing,
});

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2 font-bold text-foreground">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="text-lg tracking-tight">Matchly</span>
    </a>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#use-cases" className="transition-colors hover:text-foreground">Use cases</a>
          <a href="#waitlist" className="transition-colors hover:text-foreground">Join waitlist</a>
        </nav>
        <Button asChild size="sm" className="rounded-full px-4">
          <a href="#demo">Try the demo</a>
        </Button>
      </div>
    </header>
  );
}

interface HeroProps {
  city: string;
  setCity: (v: string) => void;
  service: string;
  setService: (v: string) => void;
  onSearch: () => void;
  loading: boolean;
  providerCount: number | null;
}

function Hero({ city, setCity, service, setService, onSearch, loading, providerCount }: HeroProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center md:pt-28 md:pb-32">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {providerCount !== null
            ? `${providerCount} Serviceanbieter verfügbar`
            : "AI-powered local recommendations"}
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl whitespace-pre-line">
          Not the best plumber in Brussels.{"\u00a0"}
          {"\n"}
          <span className="bg-[var(--gradient-primary)] bg-clip-text text-transparent">
            The best plumber for YOU
          </span>
          {"\n\n"}
          The best plumber for you.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Our AI agent learns your preferences and finds local services that actually
          match your family's needs.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-[var(--shadow-soft)] md:flex-row md:items-center"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl px-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g. Brussels)"
              className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="hidden h-8 w-px bg-border md:block" />
          <div className="flex flex-1 items-center gap-2 rounded-xl px-3">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <Input
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Service type (e.g. plumber, electrician)"
              className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" size="lg" className="rounded-xl" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Find my match
                <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          Free during beta · No credit card required
        </p>
      </div>
    </section>
  );
}

function SearchResults({
  loading,
  error,
  results,
  hasSearched,
  city,
  service,
}: {
  loading: boolean;
  error: string | null;
  results: ApiContact[];
  hasSearched: boolean;
  city: string;
  service: string;
}) {
  if (!hasSearched && !loading) return null;
  return (
    <section id="results" className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Ergebnisse
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            {loading
              ? "Suche läuft…"
              : error
                ? "Keine Verbindung zum Backend"
                : `${results.length} Treffer${
                    city || service ? ` für ${[service, city].filter(Boolean).join(" in ")}` : ""
                  }`}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Lade passende Anbieter…
          </div>
        ) : error ? (
          <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        ) : results.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Keine Anbieter gefunden. Versuche eine andere Stadt oder Serviceart.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {c.firstName} {c.lastName}
                    </h3>
                    {c.position && (
                      <p className="text-xs text-muted-foreground">{c.position}</p>
                    )}
                  </div>
                  <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    {primaryService(c)}
                  </span>
                </div>
                {c.organization?.name && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {c.organization.name}
                    {c.organization.city ? ` · ${c.organization.city}` : ""}
                  </div>
                )}
                {c.notes && (
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{c.notes}</p>
                )}
                <div className="mt-4 flex flex-col gap-1 text-xs">
                  <a
                    href={`mailto:${c.email}`}
                    className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {c.email}
                  </a>
                  <a
                    href={`tel:${c.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {c.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Problem() {
  const items = [
    {
      icon: Layers,
      title: "Too many options",
      text: "Endless lists of providers leave you scrolling instead of deciding.",
    },
    {
      icon: Target,
      title: "Generic results",
      text: "Popularity rankings don't know your home, your budget, or your kids.",
    },
    {
      icon: UserCheck,
      title: "No personal fit",
      text: "The 5-star pro nearby might still be wrong for what you actually need.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Finding the right local service is broken.
        </h2>
        <p className="mt-4 text-muted-foreground">
          We've all been there — ten tabs open, still no idea who to call.
        </p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="group rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/40"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tell us what you need",
      text: "Pick a service and your location — that's it to get started.",
    },
    {
      n: "02",
      title: "Answer 3 quick questions",
      text: "Budget, timing, priorities. Less than a minute, no account needed.",
    },
    {
      n: "03",
      title: "Get your personal top 3",
      text: "A curated shortlist matched to your family — not a random directory.",
    },
  ];
  return (
    <section id="how" className="border-y border-border bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Three steps to your perfect match.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-7">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-semibold text-primary">{s.n}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground/60 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type Priority = "price" | "reviews" | "fast";

function Demo() {
  const [city, setCity] = useState("Brussels");
  const [service, setService] = useState("Plumber");
  const [prios, setPrios] = useState<Priority[]>(["reviews"]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (p: Priority) =>
    setPrios((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const providers = [
    {
      name: "Dupont & Fils Plomberie",
      score: 94,
      tags: ["Family-run", "Same-week", "Transparent pricing"],
      blurb: "Matches your priority on reviews and fits a mid-range budget. Available Thursday.",
    },
    {
      name: "AquaFix Brussels",
      score: 88,
      tags: ["24/7", "5-star reviews"],
      blurb: "Top-rated and fast — slightly above your budget for non-urgent jobs.",
    },
    {
      name: "Léa's Plumbing Co.",
      score: 82,
      tags: ["Eco-friendly", "Female-led"],
      blurb: "Great fit if sustainability matters; books out 1–2 weeks ahead.",
    },
  ];

  return (
    <section id="demo" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Live demo
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          See your match in seconds.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Try the AI agent below — no signup required.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MessageSquare className="h-4 w-4 text-primary" />
            Matchly assistant
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-muted px-4 py-3 text-sm">
              Looking for a{" "}
              <Input
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="mx-1 inline-block h-7 w-28 border-0 border-b border-primary/40 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
              />
              in{" "}
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mx-1 inline-block h-7 w-28 border-0 border-b border-primary/40 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="rounded-xl bg-muted px-4 py-3 text-sm">
              <p className="mb-3 font-medium">Your priorities:</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { id: "price", label: "Best price" },
                  { id: "reviews", label: "Top reviews" },
                  { id: "fast", label: "Fastest available" },
                ] as { id: Priority; label: string }[]).map((p) => {
                  const active = prios.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggle(p.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />}
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={() => setSubmitted(true)}
              className="w-full rounded-xl"
              size="lg"
            >
              Generate my matches
              <Sparkles className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            {submitted
              ? `Top 3 ${service.toLowerCase() || "providers"} for you in ${city || "your city"}`
              : "Your personalized matches will appear here"}
          </div>
          <div className="space-y-3">
            {providers.map((p, i) => (
              <div
                key={p.name}
                className={`rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all ${
                  submitted ? "opacity-100" : "opacity-50"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{p.name}</h3>
                      {i === 0 && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                          Best fit
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-2xl font-bold text-primary">{p.score}%</div>
                    <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      match
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    { icon: Wrench, label: "Plumber" },
    { icon: Sparkle, label: "House cleaning" },
    { icon: Zap, label: "Electrician" },
    { icon: Baby, label: "Babysitter" },
    { icon: GraduationCap, label: "Tutor" },
    { icon: Hammer, label: "Handyman" },
  ];
  return (
    <section id="use-cases" className="border-t border-border bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Use cases
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Built for the services families actually need.
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {cases.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="waitlist" className="px-6 py-24">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-foreground p-10 text-center text-background shadow-[var(--shadow-elegant)] md:p-16">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-3 py-1 text-xs font-medium">
          <Star className="h-3.5 w-3.5" />
          Limited beta
        </div>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Be the first to try Matchly.
        </h2>
        <p className="mt-3 text-background/70">
          Join the waitlist — we're rolling out city by city.
        </p>

        {done ? (
          <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
            <Check className="h-4 w-4" /> You're on the list. Welcome aboard.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setDone(true);
            }}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-12 rounded-xl border-background/20 bg-background/10 text-background placeholder:text-background/50 focus-visible:ring-primary"
            />
            <Button type="submit" size="lg" className="h-12 rounded-xl px-6">
              Join waitlist
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <Logo />
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#use-cases" className="hover:text-foreground">Use cases</a>
          <a href="#waitlist" className="hover:text-foreground">Waitlist</a>
        </nav>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          Built with AI
        </span>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Matchly. All rights reserved.
      </div>
    </footer>
  );
}

function Landing() {
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [results, setResults] = useState<ApiContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [providerCount, setProviderCount] = useState<number | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchContacts(ctrl.signal)
      .then((data) => setProviderCount(data.length))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const all = await fetchContacts();
      setProviderCount(all.length);
      setResults(all.filter((c) => matchesSearch(c, city, service)));
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch {
      setError("Backend nicht erreichbar. Bitte später erneut versuchen.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero
          city={city}
          setCity={setCity}
          service={service}
          setService={setService}
          onSearch={handleSearch}
          loading={loading}
          providerCount={providerCount}
        />
        <SearchResults
          loading={loading}
          error={error}
          results={results}
          hasSearched={hasSearched}
          city={city}
          service={service}
        />
        <Problem />
        <HowItWorks />
        <Demo />
        <UseCases />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
