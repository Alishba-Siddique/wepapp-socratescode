"use client";
import Link from "next/link";
import { useState } from "react";
import { accountRequest } from "@/lib/account-api";
export function ResetPassword() {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  return <div className="dashboard account-page"><section className="account-card"><h1>Set a new password.</h1>{!done && <form onSubmit={async event => {
    event.preventDefault(); const password = String(new FormData(event.currentTarget).get("password")); const token = new URLSearchParams(location.search).get("token");
    if (!token) { setMessage("This recovery link is incomplete. Request a new email from your account page."); return; }
    setBusy(true); try { await accountRequest("auth/reset-password", { token, newPassword: password }); setDone(true); setMessage("Password changed. Sign in with your new password."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to reset password."); } finally { setBusy(false); }
  }}><label className="field">New password<input type="password" name="password" autoComplete="new-password" required minLength={12} maxLength={128}/></label><button className="button primary" disabled={busy}>{busy ? "Saving…" : "Change password"}</button></form>}<p role="status">{message}</p><Link prefetch={false} href="/account">Back to account</Link></section></div>;
}
