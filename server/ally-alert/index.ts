// Ally alert — the server path for SOS "tell my allies" (flags.allyAlerts = 'server').
//
// A Supabase Edge Function (Deno). It texts up to five allies one fixed
// sentence through Twilio and keeps nothing: no database, no logs of names
// or numbers. NOT DEPLOYED — see server/README.md and docs/PROGRESS.md.
//
// Request:  POST { "name": "Hayden", "to": ["+15551234567", ...] }
// Response: 200 { "sent": n } | 4xx/5xx { "error": "..." }

const MAX_RECIPIENTS = 5;
const E164 = /^\+[1-9]\d{6,14}$/;
// First names only: letters (any script), spaces, apostrophes, hyphens.
const NAME = /^[\p{L}][\p{L} '’-]{0,23}$/u;

// Best-effort brake on abuse, per warm instance, in memory only: a few alerts
// per caller per ten minutes. Nothing is written anywhere.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const recent = new Map<string, number[]>();

function allowed(caller: string, now: number): boolean {
  const hits = (recent.get(caller) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recent.set(caller, hits);
    return false;
  }
  hits.push(now);
  recent.set(caller, hits);
  return true;
}

/** The whole message. The app never sends free text, so nobody can use this to say anything else. */
function alertText(name: string): string {
  return (
    `${name} is being tempted right now and asked Rise to let you know. ` +
    `No details. A quick prayer or a text back would mean a lot.`
  );
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'POST only' });

  const caller = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!allowed(caller, Date.now())) return json(429, { error: 'too many alerts — try texting directly' });

  let body: { name?: unknown; to?: unknown };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'bad json' });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const to = Array.isArray(body.to) ? body.to : [];
  if (!NAME.test(name)) return json(400, { error: 'name' });
  if (
    to.length === 0 ||
    to.length > MAX_RECIPIENTS ||
    !to.every((n): n is string => typeof n === 'string' && E164.test(n)) ||
    new Set(to).size !== to.length
  ) {
    return json(400, { error: 'recipients' });
  }

  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = Deno.env.get('TWILIO_FROM');
  if (!sid || !token || !from) return json(503, { error: 'not configured' });

  const text = alertText(name);
  const auth = `Basic ${btoa(`${sid}:${token}`)}`;
  const results = await Promise.allSettled(
    to.map((number) =>
      fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ To: number, From: from, Body: text }),
      }).then((res) => {
        if (!res.ok) throw new Error(String(res.status));
      })
    )
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  // Anything short of everyone falls back to his own Messages app on the phone.
  return sent === to.length ? json(200, { sent }) : json(502, { error: 'partial', sent });
});
