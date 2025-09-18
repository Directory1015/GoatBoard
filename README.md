import React, { useMemo, useState, useEffect } from "react";

/**
 * GOATboard — a single‑file React starter you can paste into any Next.js/CRA/Vite app
 * Rank the Top 10 all‑time players for multiple sports using adjustable criteria.
 *
 * How to use:
 * 1) Pick a sport (Basketball or Soccer to start).
 * 2) Drag the weight sliders to match your criteria.
 * 3) The list re-ranks instantly. Copy the share link to save your settings.
 * 4) Edit the DATA object to add/remove players or add more sports.
 *
 * Notes:
 * - Pure client-side demo (no DB). Weights and sport can be shared via URL query.
 * - Metrics are 0–10. Score is a weighted average.
 * - Add your own headshots or team logos if you want.
 */

const DATA = {
  basketball: {
    label: "Basketball (NBA/ABA)",
    players: [
      {
        name: "Michael Jordan",
        era: "1984–2003",
        teams: ["CHI", "WAS"],
        metrics: { peak: 10, longevity: 9, team: 10, stats: 10, accolades: 10 },
      },
      {
        name: "LeBron James",
        era: "2003–present",
        teams: ["CLE", "MIA", "LAL"],
        metrics: { peak: 9.6, longevity: 10, team: 9.2, stats: 9.8, accolades: 9.7 },
      },
      {
        name: "Kareem Abdul-Jabbar",
        era: "1969–1989",
        teams: ["MIL", "LAL"],
        metrics: { peak: 9.3, longevity: 10, team: 9.5, stats: 9.4, accolades: 9.8 },
      },
      {
        name: "Magic Johnson",
        era: "1979–1996",
        teams: ["LAL"],
        metrics: { peak: 9.5, longevity: 8.8, team: 9.9, stats: 9.2, accolades: 9.4 },
      },
      {
        name: "Bill Russell",
        era: "1956–1969",
        teams: ["BOS"],
        metrics: { peak: 9.2, longevity: 9.2, team: 10, stats: 8.6, accolades: 9.6 },
      },
      {
        name: "Wilt Chamberlain",
        era: "1959–1973",
        teams: ["PHI", "SFW", "LAL"],
        metrics: { peak: 9.7, longevity: 9.1, team: 8.8, stats: 10, accolades: 9.0 },
      },
      {
        name: "Tim Duncan",
        era: "1997–2016",
        teams: ["SAS"],
        metrics: { peak: 9.0, longevity: 9.7, team: 9.6, stats: 8.9, accolades: 9.2 },
      },
      {
        name: "Larry Bird",
        era: "1979–1992",
        teams: ["BOS"],
        metrics: { peak: 9.4, longevity: 8.6, team: 9.3, stats: 9.1, accolades: 9.0 },
      },
      {
        name: "Shaquille O'Neal",
        era: "1992–2011",
        teams: ["ORL", "LAL", "MIA", "PHX", "CLE", "BOS"],
        metrics: { peak: 9.5, longevity: 8.9, team: 9.2, stats: 9.3, accolades: 9.1 },
      },
      {
        name: "Stephen Curry",
        era: "2009–present",
        teams: ["GSW"],
        metrics: { peak: 9.4, longevity: 9.1, team: 9.4, stats: 9.2, accolades: 9.0 },
      },
      {
        name: "Kobe Bryant",
        era: "1996–2016",
        teams: ["LAL"],
        metrics: { peak: 9.3, longevity: 9.4, team: 9.1, stats: 9.0, accolades: 9.1 },
      },
    ],
  },
  soccer: {
    label: "Soccer (Men's)",
    players: [
      {
        name: "Lionel Messi",
        era: "2004–present",
        teams: ["BAR", "PSG", "Inter Miami"],
        metrics: { peak: 10, longevity: 9.8, team: 9.5, stats: 10, accolades: 9.9 },
      },
      {
        name: "Pelé",
        era: "1957–1977",
        teams: ["Santos", "NY Cosmos"],
        metrics: { peak: 9.8, longevity: 9.4, team: 9.7, stats: 9.7, accolades: 9.8 },
      },
      {
        name: "Cristiano Ronaldo",
        era: "2003–present",
        teams: ["Sporting", "MUFC", "RMA", "Juve", "Al Nassr"],
        metrics: { peak: 9.7, longevity: 10, team: 9.2, stats: 9.9, accolades: 9.6 },
      },
      {
        name: "Diego Maradona",
        era: "1976–1997",
        teams: ["Argentinos", "BOC", "BAR", "NAP"],
        metrics: { peak: 9.9, longevity: 8.7, team: 9.2, stats: 9.4, accolades: 9.1 },
      },
      {
        name: "Johan Cruyff",
        era: "1964–1984",
        teams: ["Ajax", "BAR", "Feyenoord"],
        metrics: { peak: 9.5, longevity: 9.0, team: 9.3, stats: 9.1, accolades: 9.2 },
      },
      {
        name: "Zinedine Zidane",
        era: "1989–2006",
        teams: ["Juve", "RMA"],
        metrics: { peak: 9.3, longevity: 8.9, team: 9.4, stats: 8.8, accolades: 9.2 },
      },
      {
        name: "Alfredo Di Stéfano",
        era: "1945–1966",
        teams: ["RMA"],
        metrics: { peak: 9.4, longevity: 9.3, team: 9.8, stats: 9.2, accolades: 9.3 },
      },
      {
        name: "Franz Beckenbauer",
        era: "1964–1983",
        teams: ["Bayern", "HSV", "NY Cosmos"],
        metrics: { peak: 9.2, longevity: 9.2, team: 9.5, stats: 8.7, accolades: 9.2 },
      },
      {
        name: "Ronaldo Nazário",
        era: "1993–2011",
        teams: ["BAR", "INT", "RMA", "MIL"],
        metrics: { peak: 9.8, longevity: 8.2, team: 9.0, stats: 9.4, accolades: 8.9 },
      },
      {
        name: "Xavi Hernández",
        era: "1998–2019",
        teams: ["BAR", "Al-Sadd"],
        metrics: { peak: 9.1, longevity: 9.5, team: 9.7, stats: 8.6, accolades: 9.0 },
      },
      {
        name: "Andrés Iniesta",
        era: "2002–2024",
        teams: ["BAR", "Vissel Kobe", "Emirates Club"],
        metrics: { peak: 9.2, longevity: 9.4, team: 9.6, stats: 8.5, accolades: 9.0 },
      },
    ],
  },
};

const DEFAULT_WEIGHTS = { peak: 28, longevity: 22, team: 20, stats: 20, accolades: 10 } as const; // must sum ~100

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

function scorePlayer(metrics: Record<string, number>, weights: Record<string, number>) {
  const wsum = Object.values(weights).reduce((a, b) => a + b, 0);
  let total = 0;
  for (const k of Object.keys(weights)) {
    const m = clamp01(metrics[k] / 10); // normalize 0–1
    total += m * weights[k];
  }
  return (total / wsum) * 100; // 0–100
}

function useQuerySync(sport: string, setSport: (s: string) => void, weights: any, setWeights: (w: any) => void) {
  // Load from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qsSport = params.get("sport");
    const w = params.get("w");
    if (qsSport && DATA[qsSport as keyof typeof DATA]) setSport(qsSport);
    if (w) {
      try {
        const decoded = JSON.parse(atob(w));
        setWeights((prev: any) => ({ ...prev, ...decoded }));
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to URL when changed
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("sport", sport);
    const compact = btoa(JSON.stringify(weights));
    params.set("w", compact);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
  }, [sport, weights]);
}

export default function GOATboard() {
  const [sport, setSport] = useState<keyof typeof DATA>("basketball");
  const [weights, setWeights] = useState<Record<string, number>>({ ...DEFAULT_WEIGHTS });

  useQuerySync(sport, s => setSport(s as any), weights, setWeights);

  const list = useMemo(() => {
    const players = DATA[sport].players.map(p => ({
      ...p,
      score: scorePlayer(p.metrics, weights),
    }));
    players.sort((a, b) => b.score - a.score);
    return players.slice(0, 10);
  }, [sport, weights]);

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 backdrop-blur bg-neutral-950/70 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">GOATboard</h1>
            <p className="text-sm text-neutral-400">Rank the Top 10 all‑time players — your sliders, your gospel.</p>
          </div>
          <nav className="flex items-center gap-2">
            {Object.entries(DATA).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setSport(key as keyof typeof DATA)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  sport === key
                    ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
                    : "border-neutral-700 hover:border-neutral-500"
                }`}
              >{cfg.label}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Top 10 — {DATA[sport].label}</h2>
            <span className="text-xs text-neutral-400">Weights total: {totalWeight}</span>
          </div>

          <ol className="space-y-3">
            {list.map((p, i) => (
              <li key={p.name} className="border border-neutral-800 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black tabular-nums w-8 inline-block text-neutral-400">{i + 1}</span>
                      <h3 className="text-xl font-bold">{p.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">{p.era}</span>
                    </div>
                    <div className="mt-1 text-sm text-neutral-400">Teams: {p.teams.join(" • ")}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold tabular-nums">{p.score.toFixed(1)}</div>
                    <div className="w-40 h-2 bg-neutral-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-emerald-400" style={{ width: `${p.score}%` }} />
                    </div>
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="text-sm text-neutral-300 cursor-pointer">See metrics</summary>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                    {Object.entries(p.metrics).map(([k, v]) => (
                      <div key={k} className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 flex items-center justify-between">
                        <span className="capitalize text-neutral-400">{k}</span>
                        <span className="font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <aside className="space-y-6">
          <div className="border border-neutral-800 rounded-2xl p-4">
            <h3 className="font-semibold mb-3">Tweak the criteria</h3>
            <div className="space-y-4">
              {Object.keys(DEFAULT_WEIGHTS).map((key) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{key}</span>
                    <span className="tabular-nums">{weights[key]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    step={1}
                    value={weights[key]}
                    onChange={(e) => setWeights({ ...weights, [key]: parseInt(e.target.value, 10) })}
                    className="w-full"
                  />
                </div>
              ))}
              <button
                onClick={() => setWeights({ ...DEFAULT_WEIGHTS })}
                className="w-full mt-2 px-3 py-2 rounded-xl bg-neutral-200 text-neutral-900 font-semibold hover:bg-white transition"
              >Reset weights</button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied! Share it and your settings will load.");
                }}
                className="w-full mt-2 px-3 py-2 rounded-xl bg-emerald-400 text-neutral-900 font-bold hover:bg-emerald-300 transition"
              >Share this ranking</button>
            </div>
          </div>

          <div className="border border-neutral-800 rounded-2xl p-4">
            <h3 className="font-semibold mb-2">How scoring works</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Each player has five metrics (0–10): <strong>Peak</strong>, <strong>Longevity</strong>, <strong>Team Success</strong>, <strong>Stats</strong>, and <strong>Accolades</strong>.
              You control the weight of each metric. A weighted average produces the final score (0–100). Rankings update live.
            </p>
          </div>

          <div className="border border-neutral-800 rounded-2xl p-4">
            <h3 className="font-semibold mb-2">Make it yours</h3>
            <ul className="list-disc list-inside text-sm text-neutral-300 space-y-1">
              <li>Edit the <code>DATA</code> object to add sports or players (keep metrics 0–10).</li>
              <li>Add a backend (Supabase/Firebase) to save community ballots.</li>
              <li>Enable up/downvote and compute a community GOATboard.</li>
              <li>Attach images/logos and player bio modals.</li>
              <li>SEO: static JSON-LD for TopList and Player pages.</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-10 pt-4 text-xs text-neutral-500">
        Built with ❤️ — swap in your own data, colors, and opinions. Opinions required.
      </footer>
    </div>
  );
}
