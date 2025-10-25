import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface MatchAction {
  period: string;
  time: string;
  action: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customUrl = searchParams.get('url');

    // Si aucun lien n’est fourni, on renvoie une erreur
    if (!customUrl) {
      return NextResponse.json({ error: 'Aucun lien fourni.' }, { status: 400 });
    }

    // Scraping du lien
    const { data } = await axios.get(customUrl);
    const $ = cheerio.load(data);

    const actions: MatchAction[] = [];
    let currentPeriod = '1ST';

    $('table tr').each((_, row) => {
      const cols = $(row).find('td');
      const time = $(cols[0]).text().trim();
      const text = $(cols[1]).text().trim();

      // Détection de la période
      const header = $(row).find('th').first().text().trim().toUpperCase();
      if (header.includes('1ST')) currentPeriod = '1ST';
      else if (header.includes('2ND')) currentPeriod = '2ND';
      else if (header.includes('3RD')) currentPeriod = '3RD';
      else if (header.includes('4TH')) currentPeriod = '4TH';

      // Si c’est une action réelle
      if (time && text) {
        actions.push({ period: currentPeriod, time, action: text });
      }
    });

    const sorted = actions.sort((a, b) => {
      const periodOrder = ['1ST', '2ND', '3RD', '4TH'];
      const diff = periodOrder.indexOf(a.period) - periodOrder.indexOf(b.period);
      if (diff !== 0) return diff;
      return b.time.localeCompare(a.time);
    });

    return NextResponse.json({ actions: sorted });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erreur lors du scraping', details: error.message },
      { status: 500 }
    );
  }
}
