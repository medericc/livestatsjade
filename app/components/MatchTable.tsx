'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

interface RawActionRow extends Array<string> {
  0: string; // période
  1: string; // chrono
  2: string; // texte brut d'action
}

interface MatchTableProps {
  data: RawActionRow[];
}

export default function MatchTable({ data }: MatchTableProps) {
  useEffect(() => {
    console.log('📊 Données reçues par MatchTable:', data);
  }, [data]);

  // 🧠 Traduit le texte brut en action + statut
  const traduireAction = (texte: string): { action: string; statut: string } | null => {
    const t = texte.toUpperCase();

    if (!t.includes('CELERIER')) return null; // On ne garde que ses actions

    // 🎯 Lancers francs
    if (t.includes('MADE FREE THROW')) return { action: 'Lancer franc', statut: '✔️' };
    if (t.includes('MISSED FREE THROW')) return { action: 'Lancer franc', statut: '❌' };

    // 🏀 Tir à 3 points
    if (t.includes('MADE 3-PT')) return { action: 'Tir à 3', statut: '✔️' };
    if (t.includes('MISSED 3-PT')) return { action: 'Tir à 3', statut: '❌' };

    // 🏀 Tir à 2 points
    if (t.includes('MADE JUMP SHOT') || t.includes('MADE LAYUP'))
      return { action: 'Tir à 2', statut: '✔️' };
    if (t.includes('MISSED JUMP SHOT') || t.includes('MISSED LAYUP'))
      return { action: 'Tir à 2', statut: '❌' };

    // 🔄 Entrées / sorties
    if (t.includes('ENTERS THE GAME')) return { action: 'Entrée', statut: '✔️' };
    if (t.includes('GOES TO THE BENCH')) return { action: 'Sortie', statut: '❌' };

    // 🧱 Autres actions
    if (t.includes('REBOUND')) return { action: 'Rebond', statut: '✔️' };
    if (t.includes('ASSIST')) return { action: 'Passe décisive', statut: '✔️' };
    if (t.includes('STEAL')) return { action: 'Interception', statut: '✔️' };
    if (t.includes('TURNOVER')) return { action: 'Perte de balle', statut: '❌' };
    if (t.includes('BLOCK')) return { action: 'Contre', statut: '✔️' };
    if (t.includes('FOUL')) return { action: 'Faute', statut: '❌' };

    return null;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 w-full">
      {[1, 2, 3, 4].map((period) => (
        <Card key={period}>
          <CardContent>
            <h3 className="text-lg font-bold text-center mt-6 mb-3 text-purple-500">
              PÉRIODE {period}
            </h3>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-bold">Chrono</TableHead>
                  <TableHead className="text-center font-bold">Action</TableHead>
                  <TableHead className="text-center font-bold">Réussite</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data
                  .filter((row) => row[0] === `${period}`)
                  .map((row, index) => {
                    const texte = (row[2] || '').trim();
                    const trad = traduireAction(texte);
                    if (!trad) return null;
  if (['Entrée en jeu', 'Sortie de jeu', 'Faute'].includes(trad.action)) return null;

                    const { action, statut } = trad;
                    const statutColor =
                      statut === '✔️' ? 'text-green-500 text-lg' : 'text-red-500 text-lg';

                    return (
                      <TableRow key={index}>
                        <TableCell className="text-center">{row[1]}</TableCell>
                        <TableCell className="text-center font-medium text-white">
                          {action}
                        </TableCell>
                        <TableCell className={`text-center ${statutColor}`}>{statut}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
