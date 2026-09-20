"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useAccount } from "./account-provider";
import { AccountError, accountRequest } from "@/lib/account-api";
import { getPuzzle } from "@/lib/puzzles";
export function AccountPanel() {
  const account = useAccount();
  const [mode, setMode] = useState<"sign-in" | "sign-up" | "recovery">("sign-in");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(n => Math.max(0, n - 1)), 1000);
    return () => clearInterval(timer);
  }, [countdown]);
  async function perform(action: () => Promise<void>) {
    setBusy(true); setMessage("");
    try { await action(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); if (error instanceof AccountError) setCountdown(error.retryAfter); }
    finally { setBusy(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await perform(async () => {
      const email = String(form.get("email"));
      if (mode === "recovery") {
        await accountRequest("auth/request-password-reset", { email, redirectTo: `${location.origin}/account/reset` });
        setMessage("If an account exists for that email, recovery instructions will be sent."); return;
      }
      await accountRequest(`auth/${mode}/email`, { email, password: String(form.get("password")), ...(mode === "sign-up" ? { name: String(form.get("name")) } : {}), callbackURL: `${location.origin}/account` });
      await account.refresh();
      if (mode === "sign-up") setMessage("Account created. If email verification is required, check your inbox before signing in.");
    });
  }
  return <div className="dashboard page-enter account-page">
    <div className="page-heading"><div><p className="eyebrow">YOUR WORK. YOUR ACCOUNT.</p><h1>{account.user ? "Keep your thinking." : "A place for your progress."}</h1><p>Save a lab, return on another device, and pick up the question.</p></div></div>
    {account.loading ? <p role="status">Checking your account…</p> : account.user ? <>
      <section className="account-card"><h2>{account.user.name}</h2><p>{account.user.email}</p><p>Use “Save to account” inside a lab before leaving. Unsaved account edits stay in this open tab.</p><button className="button secondary" disabled={busy || countdown > 0} onClick={() => void perform(account.signOut)}>Sign out</button></section>
      <section className="account-card"><h2>Bring your guest work with you.</h2><p>This imports labs from this browser. Existing account saves take priority. Importing reloads your saved account progress, so save any open edits first. Your guest copy is kept.</p><button className="button primary" disabled={busy || countdown > 0} onClick={() => void perform(async () => { await account.importGuest(); setMessage("Guest import complete. Existing account saves were preserved."); })}>Import guest progress</button></section>
      <section className="account-card"><h2>Saved to your account</h2>{account.saved.length === 0 ? <p>No saved labs yet. Start a lab or import your guest work.</p> : <ul className="account-saves">{account.saved.map(row => <li key={row.labSlug}><Link prefetch={false} href={`/learn/${row.labSlug}`}>{getPuzzle(row.labSlug)?.title ?? row.labSlug}</Link><span>Revision {row.revision} · {new Date(row.updatedAt).toLocaleDateString()}</span></li>)}</ul>}<p>Reloading replaces unsaved edits in this tab with your account saves.</p><button className="button secondary" disabled={busy || countdown > 0} onClick={() => void perform(account.refresh)}>Reload account progress</button></section>
    </> : !account.available ? <section className="account-card"><h2>{account.error ? "Account connection interrupted." : "Guest learning is available."}</h2><p>{account.error || "Account storage is not connected on this deployment yet. Your guided labs and browser progress are available now."}</p><Link prefetch={false} className="button primary" href="/curriculum">Continue as a guest</Link><button className="button secondary" onClick={() => void account.refresh()}>Check connection</button></section> : <section className="account-card">
      <div className="pattern-filters" role="group" aria-label="Account action">{(["sign-in", "sign-up"] as const).map(value => <button key={value} aria-pressed={mode === value} onClick={() => { setMode(value); setMessage(""); }}>{value === "sign-in" ? "Sign in" : "Create account"}</button>)}</div>
      <h2>{mode === "recovery" ? "Recover your account" : mode === "sign-up" ? "Start your account" : "Welcome back"}</h2>
      <form onSubmit={submit}>
        {mode === "sign-up" && <label className="field">Your name<input name="name" autoComplete="name" required maxLength={80} /></label>}
        <label className="field">Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        {mode !== "recovery" && <label className="field">Password<input name="password" type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} required minLength={mode === "sign-up" ? 12 : 1} maxLength={128} />{mode === "sign-up" && <small>Use at least 12 characters.</small>}</label>}
        <button className="button primary" disabled={busy || countdown > 0}>{busy ? "Please wait…" : mode === "recovery" ? "Send recovery email" : mode === "sign-up" ? "Create my account" : "Sign in to my account"}</button>
      </form>
      {account.recovery && <button className="text-button" onClick={() => { setMode("recovery"); setMessage(""); }}>Forgot your password?</button>}
      <p className="storage-note">Guest work is only imported when you choose to bring it into your account.</p>
    </section>}
    <p role="status" className="account-message">{message || account.error}{countdown > 0 && ` Try again in ${countdown} seconds.`}</p>
  </div>;
}
export function SaveAccountProgress({ slug }: { slug: string }) {
  const { user, saveLab } = useAccount();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [until, setUntil] = useState(0);
  const [remaining, setRemaining] = useState(0);
  useEffect(() => { if (!until) return; const timer = setInterval(() => setRemaining(Math.max(0, Math.ceil((until - Date.now()) / 1000))), 500); return () => clearInterval(timer); }, [until]);
  if (!user) return null;
  return <div className="account-save"><button className="button secondary" disabled={busy || remaining > 0} onClick={async () => {
    setBusy(true); setMessage("");
    try { await saveLab(slug); setMessage("Saved to your account. You can return on another device."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save."); if (error instanceof AccountError && error.retryAfter) { setRemaining(error.retryAfter); setUntil(Date.now() + error.retryAfter * 1000); } }
    finally { setBusy(false); }
  }}>{busy ? "Saving…" : remaining > 0 ? `Wait ${remaining}s` : "Save to account"}</button><p role="status">{message || "Save before leaving; account edits are not saved automatically."}</p></div>;
}
