export type PacketMeta = {
  sessionId: string;
  packetId: string;
  category: string;
  createdAt: string;
};

const SESSION_KEY = "cs_intake_session_id_v1";
const PACKETS_KEY = "cs_intake_packets_v1";
const ACTIVE_KEY = "cs_intake_active_packet_v1";

const isBrowser = () => typeof window !== "undefined";

const safeParse = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export const normalizeCategory = (category: string | null | undefined) => {
  const normalized = (category ?? "").toLowerCase();
  if (normalized === "not-sure") return "unsure";
  return normalized;
};

export function getOrCreateSessionId(): string {
  if (!isBrowser()) return "";
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const next = randomId();
  window.localStorage.setItem(SESSION_KEY, next);
  return next;
}

function readPacketMap(): Record<string, PacketMeta> {
  if (!isBrowser()) return {};
  return safeParse<Record<string, PacketMeta>>(window.localStorage.getItem(PACKETS_KEY)) ?? {};
}

function writePacketMap(map: Record<string, PacketMeta>) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PACKETS_KEY, JSON.stringify(map));
}

export function getActivePacket(): PacketMeta | null {
  if (!isBrowser()) return null;
  return safeParse<PacketMeta>(window.localStorage.getItem(ACTIVE_KEY));
}

export function setActivePacket(packet: PacketMeta): PacketMeta {
  if (!isBrowser()) return packet;
  window.localStorage.setItem(ACTIVE_KEY, JSON.stringify(packet));
  const map = readPacketMap();
  map[packet.category] = packet;
  writePacketMap(map);
  return packet;
}

export function ensurePacketForCategory(categoryInput: string): PacketMeta {
  const sessionId = getOrCreateSessionId();
  const category = normalizeCategory(categoryInput);
  const map = readPacketMap();

  const existing = map[category];
  if (existing && existing.sessionId === sessionId) {
    setActivePacket(existing);
    return existing;
  }

  const packet: PacketMeta = {
    sessionId,
    packetId: randomId(),
    category,
    createdAt: new Date().toISOString(),
  };

  map[category] = packet;
  writePacketMap(map);
  setActivePacket(packet);
  return packet;
}

export function clearActivePacket() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACTIVE_KEY);
}

