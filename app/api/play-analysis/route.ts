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

    if (!customUrl) {
      return NextResponse.json({ error: 'Aucun lien fourni.' }, { status: 400 });
    }

    const { data } = await axios.get(customUrl);
    const $ = cheerio.load(data);

    const actions: MatchAction[] = [];
    let currentPeriod = '1ST';

    $('table tr').each((_, row) => {
      const headerText = $(row).text().trim().toUpperCase();

      // Détection claire des périodes (même sans <th>)
      if (headerText.includes('1ST QUARTER')) currentPeriod = '1ST';
      else if (headerText.includes('2ND QUARTER')) currentPeriod = '2ND';
      else if (headerText.includes('3RD QUARTER')) currentPeriod = '3RD';
      else if (headerText.includes('4TH QUARTER')) currentPeriod = '4TH';
      else {
        const cols = $(row).find('td');
        const time = $(cols[0]).text().trim();
        const text = $(cols[1]).text().trim();

        if (time && text) {
          actions.push({
            period: currentPeriod,
            time,
            action: text,
          });
        }
      }
    });

    // Tri correct : 1ST -> 4TH et ordre chronologique
    const periodOrder = ['1ST', '2ND', '3RD', '4TH'];
    const sorted = actions.sort((a, b) => {
      const diff = periodOrder.indexOf(a.period) - periodOrder.indexOf(b.period);
      if (diff !== 0) return diff;
      return a.time.localeCompare(b.time);
    });

    return NextResponse.json({ actions: sorted });
  } catch (error: any) {
    console.error('❌ Erreur scraping:', error.message);
    return NextResponse.json(
      { error: 'Erreur lors du scraping', details: error.message },
      { status: 500 }
    );
  }
}
