"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { accountRequest, savedFields, type SavedProgress } from "@/lib/account-api";
import { currentProgress, guestProgress, parseProgress, selectAccountProgress } from "@/lib/progress";
import { getPuzzle } from "@/lib/puzzles";
type User = { id: string; name: string; email: string };
type AccountContext = {
  user: User | null; loading: boolean; available: boolean; recovery: boolean; error: string;
  saved: SavedProgress[]; refresh: () => Promise<void>; signOut: () => Promise<void>;
  saveLab: (slug: string) => Promise<void>; importGuest: () => Promise<void>;
};
const Account = createContext<AccountContext | null>(null);
export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<SavedProgress[]>([]);
  const currentUser = useRef<string | null>(null);
  const sessionEpoch = useRef(0);
  const sessionRequest = useRef<AbortController | null>(null);
  const revision = useRef<SavedProgress[]>([]);
  const importAttempt = useRef({ payload: "", key: "" });
  const accept = useCallback((id: string, rows: SavedProgress[]) => {
    revision.current = rows; setSaved(rows);
    const state = Object.fromEntries(rows.filter(row => getPuzzle(row.labSlug) && row.labVersion === 1).map(row => [row.labSlug, JSON.parse(row.state)]));
    selectAccountProgress(id, parseProgress(JSON.stringify(state)));
  }, []);
  const refresh = useCallback(async () => {
    const epoch = ++sessionEpoch.current;
    sessionRequest.current?.abort();
    const controller = new AbortController(); sessionRequest.current = controller;
    try {
      const status = await accountRequest<{ available: boolean; emailRecovery?: boolean }>("account/status", undefined, controller.signal);
      if (epoch !== sessionEpoch.current) return;
      setAvailable(status.available); setRecovery(!!status.emailRecovery);
      if (!status.available) { currentUser.current = null; setUser(null); setSaved([]); selectAccountProgress(null); return; }
      const session = await accountRequest<{ user?: User } | null>("auth/get-session", undefined, controller.signal);
      if (epoch !== sessionEpoch.current) return;
      if (!session?.user) { currentUser.current = null; setUser(null); setSaved([]); selectAccountProgress(null); return; }
      const response = await accountRequest<{ data: { myProgress: SavedProgress[] } }>("graphql", { query: `query MyProgress { myProgress { ${savedFields} } }` }, controller.signal);
      if (epoch !== sessionEpoch.current) return;
      currentUser.current = session.user.id; setUser(session.user); accept(session.user.id, response.data.myProgress); setError("");
    } catch (e) { if (epoch === sessionEpoch.current) setError(e instanceof Error ? e.message : "Could not load account progress."); }
    finally { if (epoch === sessionEpoch.current) setLoading(false); }
  }, [accept]);
  useEffect(() => {
    // Synchronize with the external session service; refresh awaits network I/O
    // before updating state. It also remains callable by explicit user actions.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    const epochRef = sessionEpoch;
    const requestRef = sessionRequest;
    const cancel = () => { epochRef.current++; requestRef.current?.abort(); };
    const resume = (event: PageTransitionEvent) => { if (event.persisted) void refresh(); };
    window.addEventListener("pagehide", cancel);
    window.addEventListener("pageshow", resume);
    return () => { cancel(); window.removeEventListener("pagehide", cancel); window.removeEventListener("pageshow", resume); selectAccountProgress(null); };
  }, [refresh]);
  const signOut = async () => {
    sessionEpoch.current++;
    sessionRequest.current?.abort();
    await accountRequest("auth/sign-out", {});
    sessionEpoch.current++;
    currentUser.current = null; revision.current = []; setUser(null); setSaved([]); selectAccountProgress(null);
  };
  const saveLab = async (slug: string) => {
    const id = currentUser.current;
    if (!id) throw new Error("Sign in before saving to your account.");
    const state = currentProgress()[slug];
    if (!state) throw new Error("Start this lab before saving.");
    const response = await accountRequest<{ data: { saveProgress: SavedProgress } }>("graphql", {
      query: `mutation SaveProgress($input: SaveProgressInput!) { saveProgress(input: $input) { ${savedFields} } }`,
      variables: { input: { labSlug: slug, labVersion: 1, expectedRevision: revision.current.find(row => row.labSlug === slug)?.revision ?? 0, state: JSON.stringify(state) } },
    });
    if (currentUser.current !== id) return;
    const rows = [...revision.current.filter(row => row.labSlug !== slug), response.data.saveProgress];
    revision.current = rows; setSaved(rows);
  };
  const importGuest = async () => {
    const id = currentUser.current;
    if (!id) throw new Error("Sign in before importing.");
    const entries = Object.entries(guestProgress()).filter(([slug]) => getPuzzle(slug)).map(([labSlug, state]) => ({ labSlug, labVersion: 1, state: JSON.stringify(state) }));
    if (!entries.length) throw new Error("There is no guest progress to import from this browser.");
    const payload = JSON.stringify(entries);
    if (importAttempt.current.payload !== payload) importAttempt.current = { payload, key: crypto.randomUUID() };
    const response = await accountRequest<{ data: { importGuestProgress: SavedProgress[] } }>("graphql", {
      query: `mutation ImportGuest($key: String!, $entries: [GuestProgressInput!]!) { importGuestProgress(key: $key, entries: $entries) { ${savedFields} } }`,
      variables: { key: importAttempt.current.key, entries },
    });
    if (currentUser.current === id) accept(id, response.data.importGuestProgress);
  };
  return <Account.Provider value={{ user, loading, available, recovery, error, saved, refresh, signOut, saveLab, importGuest }}>{children}</Account.Provider>;
}
export function useAccount() {
  const value = useContext(Account);
  if (!value) throw new Error("Account provider is missing.");
  return value;
}
