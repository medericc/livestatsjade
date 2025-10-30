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
  0: string; // period
  1: string; // time
  2: string; // action
}

interface MatchTableProps {
  data: RawActionRow[];
}

export default function MatchTable({ data }: MatchTableProps) {
  useEffect(() => {
    console.log('📊 Données reçues par MatchTable:', data);
  }, [data]);

  // 🧠 Fonction stricte : prend le texte brut et renvoie le libellé + statut
  const traduireSmithAction = (texte: string): { action: string; statut: string } | null => {
    const t = texte.toUpperCase();

    if (!t.includes('SHORNA')) return null; // On ne garde que les actions de Destinee

    if (t.includes('GOOD FT')) return { action: 'Lancer franc', statut: '✔️' };
    if (t.includes('MISS FT')) return { action: 'Lancer franc', statut: '❌' };

    // 🏀 Tir à 3 points
    if (t.includes('GOOD 3PTR')) return { action: 'Tir à 3 pts', statut: '✔️' };
    if (t.includes('MISS 3PTR')) return { action: 'Tir à 3 pts', statut: '❌' };

     // 🏀 Tir à 2 points — tous les GOOD/MISS sans 3PTR = 2 pts
    if (t.includes('GOOD') && !t.includes('3PT')) return { action: 'Tir à 2 pts', statut: '✔️' };
    if (t.includes('MISS') && !t.includes('3PT')) return { action: 'Tir à 2 pts', statut: '❌' };

    if (t.includes('REBOUND')) return { action: 'Rebond', statut: '✔️' };
    if (t.includes('ASSIST')) return { action: 'Passe décisive', statut: '✔️' };
    if (t.includes('TURNOVER')) return { action: 'Perte de balle', statut: '❌' };
    if (t.includes('FOUL')) return { action: 'Faute', statut: '❌' };

    if (t.includes('SUB IN')) return { action: 'Entrée en jeu', statut: '✔️' };
    if (t.includes('SUB OUT')) return { action: 'Sortie de jeu', statut: '✔️' };

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
                    const texte = (row[2] || '').trim();  const actionSmith = traduireSmithAction(texte);

                    if (!actionSmith) return null; // On ignore tout sauf SMITH

                    const { action, statut } = actionSmith;

                    return (
                      <TableRow key={index}>
                        <TableCell className="text-center">{row[1]}</TableCell>
                        {/* 🟢 Ici on affiche uniquement le texte traduit */}
                        <TableCell className="text-center font-medium text-white">
                          {action}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={
                              statut === '✔️'
                                ? 'text-green-500 text-lg'
                                : 'text-red-500 text-lg'
                            }
                          >
                            {statut}
                          </span>
                        </TableCell>
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
