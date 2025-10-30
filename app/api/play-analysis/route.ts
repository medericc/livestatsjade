import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
interface Play {
  period: string;
  time: string;
  action: string;
}

// --- ta fonction de parsing, inchangée ---
async function parsePlays(html: string) {
  const $ = cheerio.load(html);
  const plays: Play[] = [];


  // 🧱 Parcours explicite des div#period-x
  for (let i = 1; i <= 4; i++) {
    const panel = $(`#period-${i}`);
    if (!panel.length) continue;

    const caption = panel.find("caption").text().trim().toUpperCase();
    console.log(`🎯 Détection: #period-${i} → ${caption || "(vide)"}`);

    const period = `${i}`; // on se base sur l’ID, fiable à 100 %

    panel.find("tbody tr").each((_, tr) => {
      const tds = $(tr).find("td");
      const time = $(tds[0]).text().trim();
      const leftAction = $(tds[1]).text().trim();
      const rightAction = $(tds[5]).text().trim();
      const action = leftAction || rightAction;

      if (!time || !action || time === "--" || action === "") return;

      plays.push({ period, time, action });
    });
  }

  // 🧹 Tri
  const toSeconds = (t: string) => {
    const [m, s] = t.split(":").map(Number);
    return m * 60 + s;
  };
  plays.sort((a, b) => {
    const pOrder = parseInt(a.period) - parseInt(b.period);
    if (pOrder !== 0) return pOrder;
    return toSeconds(a.time) - toSeconds(b.time);
  });

  console.log("✅ Plays finaux:", plays.slice(0, 10));
  console.log(`📦 Total: ${plays.length}`);

  return plays;
}


// --- la route API Next.js ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const matchUrl = searchParams.get("url");

    if (!matchUrl) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    console.log("🌍 Fetching:", matchUrl);
    const res = await fetch(matchUrl);
    const html = await res.text();

    const actions = await parsePlays(html);
    console.log(`✅ ${actions.length} actions trouvées.`);

    return NextResponse.json({ actions });
  } catch (err) {
    console.error("❌ Erreur backend:", err);
    return NextResponse.json(
      { error: "Scraping failed or bad HTML" },
      { status: 500 }
    );
  }
}
