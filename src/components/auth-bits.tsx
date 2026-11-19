"use client";

import { useId, useState } from "react";

const input = "w-full rounded-full border border-ink/12 bg-white px-5 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-ink focus:ring-4 focus:ring-safelight/15";

export function TextField({ label, hint, ...rest }: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input id={id} {...rest} className={input} />
      {hint && <p className="mt-1.5 px-2 text-xs text-ink/45">{hint}</p>}
    </div>
  );
}

// Password with a show/hide button and, for new accounts, a strength bar.
export function PasswordField({ label = "Password", meter = false, aside, ...rest }: { label?: string; meter?: boolean; aside?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const score = (value.length >= 8 ? 1 : 0) + (/[A-Z]/.test(value) && /[a-z]/.test(value) ? 1 : 0) + (/\d/.test(value) ? 1 : 0) + (value.length >= 12 || /[^A-Za-z0-9]/.test(value) ? 1 : 0);
  const word = ["Too short", "Weak", "Okay", "Good", "Strong"][value ? Math.max(score, 1) : 0];
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        {aside}
      </div>
      <div className="relative">
        <input id={id} {...rest} type={show ? "text" : "password"} value={value} onChange={(e) => setValue(e.target.value)} className={`${input} pr-16`} />
        <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-semibold text-ink/55 hover:bg-ink/5 hover:text-ink">{show ? "Hide" : "Show"}</button>
      </div>
      {meter && (
        <div className="mt-2 flex items-center gap-3 px-2" aria-live="polite">
          <div className="flex flex-1 gap-1.5" aria-hidden="true">
            {[1, 2, 3, 4].map((n) => <span key={n} className={`h-1 flex-1 rounded-full transition-colors ${value && score >= n ? (score < 3 ? "bg-safelight" : "bg-ink") : "bg-ink/10"}`} />)}
          </div>
          <span className="w-14 text-right text-xs text-ink/45">{value ? word : ""}</span>
        </div>
      )}
    </div>
  );
}

const google = (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.5Z" /><path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A12 12 0 0 0 12 24Z" /><path fill="#FBBC05" d="M5.6 14.7a7.2 7.2 0 0 1 0-4.6v-3H1.8a12 12 0 0 0 0 10.6l3.8-3Z" /><path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3A12 12 0 0 0 1.8 7.1l3.8 3C6.5 6.8 9 4.8 12 4.8Z" /></svg>
);
const discord = (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="#5865F2"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.2.5a18.3 18.3 0 0 0-6.4 0L8.6 3a19.7 19.7 0 0 0-4.9 1.4C.6 9 0 13.5.3 18a19.9 19.9 0 0 0 6 3l.8-1.3-1.3-.6.3-.3a14.3 14.3 0 0 0 11.8 0l.3.3-1.3.6.8 1.3a19.8 19.8 0 0 0 6-3c.4-5.2-.7-9.7-3.4-13.6ZM8.5 15.3c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Zm7 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Z" /></svg>
);

export function SocialRow() {
  const b = "btn btn-line-ink !shadow-none border border-ink/15 bg-white py-3 hover:!bg-paper-2 hover:!text-ink";
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <button type="button" className={b}>{google} Google</button>
      <button type="button" className={b}>{discord} Discord</button>
    </div>
  );
}

export function Or() {
  return <div className="my-4 flex items-center gap-3 text-xs text-ink/40"><span className="h-px flex-1 bg-ink/12" />or with email<span className="h-px flex-1 bg-ink/12" /></div>;
}
