const BASE = process.env.ZAMMAD_URL || "http://zammad-railsserver:3000";
const TOKEN = process.env.ZAMMAD_API_TOKEN || "";

function zammadHeaders() {
  return {
    Authorization: `Token token=${TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function zammadFetch<T>(
  path: string
): Promise<{ data: T | null; error?: string }> {
  if (!TOKEN) return { data: null, error: "Zammad API token not configured" };
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: zammadHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return { data: null, error: `Zammad HTTP ${res.status}` };
    const json = await res.json();
    return { data: json };
  } catch (e) {
    return { data: null, error: String(e) };
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

export type ZammadTicket = {
  id: number;
  number: number;
  title: string;
  state_id: number;
  state: string;          // resolved from state_id
  priority_id: number;
  priority: string;       // resolved from priority_id
  group_id: number;
  group: string;          // resolved from group_id
  customer_id: number;
  customerName: string;
  customerEmail: string;
  created_at: string;
  updated_at: string;
  elapsedHours: number;
};

// Zammad REST API state_id map (default states)
const STATE_NAMES: Record<number, string> = {
  1: "new",
  2: "open",
  3: "pending reminder",
  4: "closed",
  5: "merged",
  6: "removed",
  7: "pending close",
};

// Zammad REST API priority_id map (default priorities)
const PRIORITY_NAMES: Record<number, string> = {
  1: "low",
  2: "normal",
  3: "high",
};

// ── Raw API shapes ────────────────────────────────────────────────────────────

type RawTicket = {
  id: number;
  number: number;
  title: string;
  state_id: number;
  priority_id: number;
  group_id: number;
  customer_id: number;
  created_at: string;
  updated_at: string;
};

type RawUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
};

type RawGroup = {
  id: number;
  name: string;
};

// ── API functions ─────────────────────────────────────────────────────────────

export async function getOpenTickets(): Promise<{
  tickets: ZammadTicket[];
  error?: string;
}> {
  // Fetch open tickets (state_id 1=new, 2=open, 3=pending reminder)
  const { data: raw, error } = await zammadFetch<RawTicket[]>(
    "/api/v1/tickets?state_id[]=1&state_id[]=2&state_id[]=3&per_page=50&expand=false"
  );
  if (!raw || error) return { tickets: [], error };

  // Collect unique customer_ids and group_ids for expansion
  const customerIds = [...new Set(raw.map((t) => t.customer_id))];
  const groupIds = [...new Set(raw.map((t) => t.group_id))];

  // Fetch users and groups in parallel
  const [userMap, groupMap] = await Promise.all([
    resolveUsers(customerIds),
    resolveGroups(groupIds),
  ]);

  const now = Date.now();
  const tickets: ZammadTicket[] = raw.map((t) => {
    const user = userMap[t.customer_id];
    const elapsedHours = Math.round(
      (now - new Date(t.created_at).getTime()) / 3_600_000
    );
    return {
      id: t.id,
      number: t.number,
      title: t.title,
      state_id: t.state_id,
      state: STATE_NAMES[t.state_id] || "unknown",
      priority_id: t.priority_id,
      priority: PRIORITY_NAMES[t.priority_id] || "normal",
      group_id: t.group_id,
      group: groupMap[t.group_id] || "Support",
      customer_id: t.customer_id,
      customerName: user
        ? `${user.firstname} ${user.lastname}`.trim() || user.email
        : "Unknown",
      customerEmail: user?.email || "",
      created_at: t.created_at,
      updated_at: t.updated_at,
      elapsedHours,
    };
  });

  // Sort: high priority first, then by updated_at desc
  tickets.sort((a, b) => {
    if (b.priority_id !== a.priority_id) return b.priority_id - a.priority_id;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  return { tickets };
}

async function resolveUsers(ids: number[]): Promise<Record<number, RawUser>> {
  const map: Record<number, RawUser> = {};
  await Promise.all(
    ids.map(async (id) => {
      const { data } = await zammadFetch<RawUser>(`/api/v1/users/${id}`);
      if (data) map[id] = data;
    })
  );
  return map;
}

async function resolveGroups(ids: number[]): Promise<Record<number, string>> {
  const map: Record<number, string> = {};
  await Promise.all(
    ids.map(async (id) => {
      const { data } = await zammadFetch<RawGroup>(`/api/v1/groups/${id}`);
      if (data) map[id] = data.name;
    })
  );
  return map;
}

// ── Live Chat ─────────────────────────────────────────────────────────────────

export type ZammadChat = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export async function getActiveChats(): Promise<{
  chats: ZammadChat[];
  error?: string;
}> {
  const { data, error } = await zammadFetch<ZammadChat[]>("/api/v1/chats");
  if (error) return { chats: [], error };
  return { chats: data ?? [] };
}
