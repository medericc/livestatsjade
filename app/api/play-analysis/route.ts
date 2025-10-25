// app/api/play-analysis/route.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url =
      'https://goconqs.com/sports/womens-basketball/stats/2024-25/western-texas-college/boxscore/5990';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const playAnalysis: string[][] = [];

    // Sélecteur plus large : toutes les lignes du tableau contenant les actions
    $('table tr').each((_, row) => {
      const cols: string[] = [];
      $(row)
        .find('td')
        .each((__, col) => {
          cols.push($(col).text().trim());
        });
      // On ne garde que les lignes avec un texte d'action
      if (cols.length > 0 && cols.join(' ').includes('SMITH,DESTINEE')) {
        playAnalysis.push(cols);
      }
    });

    return NextResponse.json({ playAnalysis });
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: 'Erreur lors du scraping', details },
      { status: 500 }
    );
  }
}
