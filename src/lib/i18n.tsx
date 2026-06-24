import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "de" | "fr";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.how": "How it works",
  "nav.useCases": "Use cases",
  "nav.waitlist": "Join waitlist",
  "nav.tryDemo": "Try the demo",

  "hero.badge.ai": "AI-powered local recommendations",
  "hero.badge.providers": "{n} providers available",
  "hero.title.line1": "Not the best plumber in Brussels.",
  "hero.title.line2": "The best plumber for YOU",
  "hero.title.line3": "The best plumber for you.",
  "hero.subtitle":
    "Our AI agent learns your preferences and finds local services that actually match your family's needs.",
  "hero.city": "City (e.g. Brussels)",
  "hero.service": "Service type (e.g. plumber, electrician)",
  "hero.cta": "Find my match",
  "hero.note": "Free during beta · No credit card required",

  "results.label": "Results",
  "results.searching": "Searching…",
  "results.noBackend": "Backend unreachable",
  "results.count": "{n} matches",
  "results.countFor": "{n} matches for {q}",
  "results.loading": "Loading matching providers…",
  "results.error": "Backend unreachable. Please try again later.",
  "results.empty": "No providers found. Try a different city or service.",

  "problem.title": "Finding the right local service is broken.",
  "problem.subtitle": "We've all been there — ten tabs open, still no idea who to call.",
  "problem.1.title": "Too many options",
  "problem.1.text": "Endless lists of providers leave you scrolling instead of deciding.",
  "problem.2.title": "Generic results",
  "problem.2.text": "Popularity rankings don't know your home, your budget, or your kids.",
  "problem.3.title": "No personal fit",
  "problem.3.text": "The 5-star pro nearby might still be wrong for what you actually need.",

  "how.label": "How it works",
  "how.title": "Three steps to your perfect match.",
  "how.1.title": "Tell us what you need",
  "how.1.text": "Pick a service and your location — that's it to get started.",
  "how.2.title": "Answer 3 quick questions",
  "how.2.text": "Budget, timing, priorities. Less than a minute, no account needed.",
  "how.3.title": "Get your personal top 3",
  "how.3.text": "A curated shortlist matched to your family — not a random directory.",

  "demo.label": "Live demo",
  "demo.title": "See your match in seconds.",
  "demo.subtitle": "Try the AI agent below — no signup required.",
  "demo.assistant": "Nearfix assistant",
  "demo.lookingFor": "Looking for a",
  "demo.in": "in",
  "demo.priorities": "Your priorities:",
  "demo.price": "Best price",
  "demo.reviews": "Top reviews",
  "demo.fast": "Fastest available",
  "demo.generate": "Generate my matches",
  "demo.topFor": "Top 3 {service} for you in {city}",
  "demo.placeholder": "Your personalized matches will appear here",
  "demo.bestFit": "Best fit",
  "demo.match": "match",

  "uc.label": "Use cases",
  "uc.title": "Built for the services families actually need.",
  "uc.plumber": "Plumber",
  "uc.cleaning": "House cleaning",
  "uc.electrician": "Electrician",
  "uc.babysitter": "Babysitter",
  "uc.tutor": "Tutor",
  "uc.handyman": "Handyman",

  "wait.badge": "Limited beta",
  "wait.title": "Be the first to try Nearfix.",
  "wait.subtitle": "Join the waitlist — we're rolling out city by city.",
  "wait.placeholder": "you@email.com",
  "wait.cta": "Join waitlist",
  "wait.done": "You're on the list. Check your inbox!",
  "wait.error": "Something went wrong. Please try again.",

  "prov.badge": "For professionals",
  "prov.title": "Are you a service provider?",
  "prov.text":
    "Join Nearfix and reach families who are searching for exactly your service — free and no commitment.",
  "prov.cta": "Register now",
  "prov.b1": "Relevant requests from your region",
  "prov.b2": "No commission model — you keep everything",
  "prov.b3": "List yourself in under 2 minutes",

  "footer.builtAi": "Built with AI",
  "footer.rights": "All rights reserved.",
};

const de: Dict = {
  "nav.how": "So funktioniert's",
  "nav.useCases": "Anwendungsfälle",
  "nav.waitlist": "Warteliste",
  "nav.tryDemo": "Demo testen",

  "hero.badge.ai": "KI-gestützte lokale Empfehlungen",
  "hero.badge.providers": "{n} Serviceanbieter verfügbar",
  "hero.title.line1": "Nicht der beste Klempner in Brüssel.",
  "hero.title.line2": "Der beste Klempner für DICH",
  "hero.title.line3": "Der beste Klempner für dich.",
  "hero.subtitle":
    "Unser KI-Agent lernt deine Vorlieben und findet lokale Services, die wirklich zu deiner Familie passen.",
  "hero.city": "Stadt (z.B. Brüssel)",
  "hero.service": "Service-Art (z.B. Klempner, Elektriker)",
  "hero.cta": "Finde meinen Match",
  "hero.note": "Während der Beta kostenlos · Keine Kreditkarte nötig",

  "results.label": "Ergebnisse",
  "results.searching": "Suche läuft…",
  "results.noBackend": "Keine Verbindung zum Backend",
  "results.count": "{n} Treffer",
  "results.countFor": "{n} Treffer für {q}",
  "results.loading": "Lade passende Anbieter…",
  "results.error": "Backend nicht erreichbar. Bitte später erneut versuchen.",
  "results.empty": "Keine Anbieter gefunden. Versuche eine andere Stadt oder Serviceart.",

  "problem.title": "Den richtigen lokalen Service zu finden ist mühsam.",
  "problem.subtitle":
    "Jeder kennt es — zehn Tabs offen und immer noch keine Ahnung wen anrufen.",
  "problem.1.title": "Zu viele Optionen",
  "problem.1.text": "Endlose Anbieterlisten machen dich endlos müde — statt entscheidungsfreudig.",
  "problem.2.title": "Generische Ergebnisse",
  "problem.2.text":
    "Popularitäts-Rankings kennen dein Zuhause, dein Budget oder deine Kinder nicht.",
  "problem.3.title": "Kein persönlicher Fit",
  "problem.3.text":
    "Der 5-Sterne-Profi um die Ecke ist vielleicht trotzdem falsch für das was du brauchst.",

  "how.label": "So funktioniert's",
  "how.title": "Drei Schritte zu deinem perfekten Match.",
  "how.1.title": "Sag uns was du brauchst",
  "how.1.text": "Wähle einen Service und deinen Ort — mehr ist nicht nötig.",
  "how.2.title": "Beantworte 3 kurze Fragen",
  "how.2.text": "Budget, Timing, Prioritäten. Unter einer Minute, kein Account nötig.",
  "how.3.title": "Erhalte deine persönliche Top 3",
  "how.3.text": "Eine kuratierte Auswahl für deine Familie — kein Zufallsverzeichnis.",

  "demo.label": "Live-Demo",
  "demo.title": "Sieh deinen Match in Sekunden.",
  "demo.subtitle": "Teste den KI-Agenten unten — keine Anmeldung nötig.",
  "demo.assistant": "Nearfix Assistent",
  "demo.lookingFor": "Suche nach",
  "demo.in": "in",
  "demo.priorities": "Deine Prioritäten:",
  "demo.price": "Bester Preis",
  "demo.reviews": "Top Bewertungen",
  "demo.fast": "Schnell verfügbar",
  "demo.generate": "Meine Matches anzeigen",
  "demo.topFor": "Top 3 {service} für dich in {city}",
  "demo.placeholder": "Deine persönlichen Matches erscheinen hier",
  "demo.bestFit": "Bester Match",
  "demo.match": "match",

  "uc.label": "Anwendungsfälle",
  "uc.title": "Gemacht für die Services, die Familien wirklich brauchen.",
  "uc.plumber": "Klempner",
  "uc.cleaning": "Hausreinigung",
  "uc.electrician": "Elektriker",
  "uc.babysitter": "Babysitter",
  "uc.tutor": "Nachhilfe",
  "uc.handyman": "Handwerker",

  "wait.badge": "Limitierte Beta",
  "wait.title": "Sei der Erste, der Nearfix testet.",
  "wait.subtitle": "Trage dich ein — wir starten Stadt für Stadt.",
  "wait.placeholder": "du@email.com",
  "wait.cta": "Eintragen",
  "wait.done": "Du bist auf der Liste. Schau in dein Postfach!",
  "wait.error": "Etwas ist schiefgelaufen. Bitte erneut versuchen.",

  "prov.badge": "Für Profis",
  "prov.title": "Bist du Serviceanbieter?",
  "prov.text":
    "Werde Teil von Nearfix und erreiche Familien, die genau deinen Service suchen — kostenlos und unverbindlich.",
  "prov.cta": "Jetzt registrieren",
  "prov.b1": "Passende Anfragen aus deiner Region",
  "prov.b2": "Kein Provisionsmodell — du behältst alles",
  "prov.b3": "Eintrag in unter 2 Minuten",

  "footer.builtAi": "Mit KI gebaut",
  "footer.rights": "Alle Rechte vorbehalten.",
};

const fr: Dict = {
  "nav.how": "Comment ça marche",
  "nav.useCases": "Cas d'usage",
  "nav.waitlist": "Liste d'attente",
  "nav.tryDemo": "Essayer la démo",

  "hero.badge.ai": "Recommandations locales par IA",
  "hero.badge.providers": "{n} prestataires disponibles",
  "hero.title.line1": "Pas le meilleur plombier de Bruxelles.",
  "hero.title.line2": "Le meilleur plombier pour TOI",
  "hero.title.line3": "Le meilleur plombier pour toi.",
  "hero.subtitle":
    "Notre agent IA apprend tes préférences et trouve les services locaux qui correspondent vraiment aux besoins de ta famille.",
  "hero.city": "Ville (ex. Bruxelles)",
  "hero.service": "Type de service (ex. plombier, électricien)",
  "hero.cta": "Trouver mon match",
  "hero.note": "Gratuit pendant la bêta · Sans carte bancaire",

  "results.label": "Résultats",
  "results.searching": "Recherche…",
  "results.noBackend": "Backend injoignable",
  "results.count": "{n} résultats",
  "results.countFor": "{n} résultats pour {q}",
  "results.loading": "Chargement des prestataires…",
  "results.error": "Backend injoignable. Réessaie plus tard.",
  "results.empty": "Aucun prestataire trouvé. Essaie une autre ville ou service.",

  "problem.title": "Trouver le bon service local est cassé.",
  "problem.subtitle": "On connaît tous ça — dix onglets ouverts, toujours aucune idée.",
  "problem.1.title": "Trop d'options",
  "problem.1.text": "Des listes interminables qui te font scroller au lieu de décider.",
  "problem.2.title": "Résultats génériques",
  "problem.2.text":
    "Les classements de popularité ignorent ta maison, ton budget et tes enfants.",
  "problem.3.title": "Pas de fit personnel",
  "problem.3.text":
    "Le pro 5 étoiles du coin peut quand même ne pas convenir à ton besoin réel.",

  "how.label": "Comment ça marche",
  "how.title": "Trois étapes vers ton match parfait.",
  "how.1.title": "Dis-nous ce que tu cherches",
  "how.1.text": "Choisis un service et ta ville — c'est tout pour commencer.",
  "how.2.title": "Réponds à 3 questions",
  "how.2.text": "Budget, délai, priorités. Moins d'une minute, sans compte.",
  "how.3.title": "Reçois ton top 3 personnel",
  "how.3.text": "Une sélection sur mesure pour ta famille — pas un annuaire au hasard.",

  "demo.label": "Démo live",
  "demo.title": "Vois ton match en quelques secondes.",
  "demo.subtitle": "Essaie l'agent IA ci-dessous — sans inscription.",
  "demo.assistant": "Assistant Nearfix",
  "demo.lookingFor": "Je cherche un",
  "demo.in": "à",
  "demo.priorities": "Tes priorités :",
  "demo.price": "Meilleur prix",
  "demo.reviews": "Meilleurs avis",
  "demo.fast": "Plus rapide",
  "demo.generate": "Générer mes matchs",
  "demo.topFor": "Top 3 {service} pour toi à {city}",
  "demo.placeholder": "Tes matchs personnalisés apparaîtront ici",
  "demo.bestFit": "Meilleur match",
  "demo.match": "match",

  "uc.label": "Cas d'usage",
  "uc.title": "Conçu pour les services dont les familles ont vraiment besoin.",
  "uc.plumber": "Plombier",
  "uc.cleaning": "Ménage",
  "uc.electrician": "Électricien",
  "uc.babysitter": "Baby-sitter",
  "uc.tutor": "Soutien scolaire",
  "uc.handyman": "Bricoleur",

  "wait.badge": "Bêta limitée",
  "wait.title": "Sois le premier à essayer Nearfix.",
  "wait.subtitle": "Rejoins la liste — on se déploie ville par ville.",
  "wait.placeholder": "toi@email.com",
  "wait.cta": "Rejoindre",
  "wait.done": "Tu es sur la liste. Vérifie ta boîte mail !",
  "wait.error": "Quelque chose a mal tourné. Réessaie.",

  "prov.badge": "Pour les pros",
  "prov.title": "Tu es prestataire de services ?",
  "prov.text":
    "Rejoins Nearfix et atteins les familles qui cherchent exactement ton service — gratuit et sans engagement.",
  "prov.cta": "S'inscrire",
  "prov.b1": "Des demandes pertinentes dans ta région",
  "prov.b2": "Pas de commission — tu gardes tout",
  "prov.b3": "Inscription en moins de 2 minutes",

  "footer.builtAi": "Construit avec l'IA",
  "footer.rights": "Tous droits réservés.",
};

const dicts: Record<Lang, Dict> = { en, de, fr };

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

const STORAGE_KEY = "nearfix.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with "en" on SSR + first client render to avoid hydration mismatch.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "en" || stored === "de" || stored === "fr") {
        setLangState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const raw = dicts[lang][key] ?? dicts.en[key] ?? key;
      if (!vars) return raw;
      return raw.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
    },
    [lang],
  );

  const value = useMemo<I18nCtx>(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside <LanguageProvider>");
  return v;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const options: { code: Lang; flag: string; label: string }[] = [
    { code: "en", flag: "🇬🇧", label: "EN" },
    { code: "de", flag: "🇩🇪", label: "DE" },
    { code: "fr", flag: "🇫🇷", label: "FR" },
  ];
  return (
    <div
      className={
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5 text-xs " +
        (className ?? "")
      }
    >
      {options.map((o) => {
        const active = o.code === lang;
        return (
          <button
            key={o.code}
            type="button"
            aria-label={`Switch language to ${o.label}`}
            aria-pressed={active}
            onClick={() => setLang(o.code)}
            className={
              "inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium transition-colors " +
              (active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground")
            }
          >
            <span aria-hidden className="text-sm leading-none">
              {o.flag}
            </span>
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
