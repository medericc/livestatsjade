import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

// --- ta fonction de parsing, inchangée ---
async function parsePlays(html: string) {
  const $ = cheerio.load(html);
  const plays: any[] = [];

  $(".panel").each((_, panel) => {
    const periodCaption = $(panel).find("caption").text().trim();
    const periodMatch = periodCaption.match(/(\d)(st|nd|rd|th)/i);
   const period = periodMatch ? periodMatch[0].toUpperCase() : "?";

    $(panel)
      .find("tbody tr")
      .each((_, tr) => {
        const tds = $(tr).find("td");
        const time = $(tds[0]).text().trim();
        const leftAction = $(tds[1]).text().trim();
        const rightAction = $(tds[5]).text().trim();

        const action = leftAction || rightAction;

        if (
          !time ||
          !action ||
          time === "--" ||
          action === "" ||
          action.match(/^\d+\s+\w+/)
        ) {
          return;
        }

        plays.push({ period, time, action });
      });
  });

  const toSeconds = (t: string) => {
    const [m, s] = t.split(":").map(Number);
    return m * 60 + s;
  };

  plays.sort((a, b) => {
    const pOrder = parseInt(a.period) - parseInt(b.period);
    if (pOrder !== 0) return pOrder;
    return toSeconds(a.time) - toSeconds(b.time);
  });

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
