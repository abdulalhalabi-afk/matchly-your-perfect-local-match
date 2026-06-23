export const MATCHLY_API_BASE = "https://matchly-crm.onrender.com";

export interface ApiOrganization {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
}

export interface ApiContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position?: string;
  status: "active" | "inactive" | string;
  tags?: string;
  notes?: string;
  organization?: ApiOrganization;
}

export async function fetchContacts(signal?: AbortSignal): Promise<ApiContact[]> {
  const res = await fetch(`${MATCHLY_API_BASE}/api/contacts`, { signal });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = (await res.json()) as ApiContact[];
  return Array.isArray(data) ? data : [];
}

export function contactTags(c: ApiContact): string[] {
  return (c.tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function primaryService(c: ApiContact): string {
  return contactTags(c)[0] ?? "Service";
}

export function matchesSearch(c: ApiContact, city: string, service: string): boolean {
  const cityQ = city.trim().toLowerCase();
  const svcQ = service.trim().toLowerCase();
  const cityVal = (c.organization?.city ?? "").toLowerCase();
  const haystack = [
    c.tags ?? "",
    c.position ?? "",
    c.notes ?? "",
    c.organization?.name ?? "",
  ]
    .join(" ")
    .toLowerCase();
  const cityOk = !cityQ || cityVal.includes(cityQ);
  const svcOk = !svcQ || haystack.includes(svcQ);
  return cityOk && svcOk;
}
