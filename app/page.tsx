'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VideoHeader from './components/VideoHeader';
import { Button } from '@/components/ui/button';

interface MatchAction {
  period: string;
  time: string;
  action: string;
  success?: string;
}

// 🗺️ Traductions des types d’action
const actionMapping: Record<string, string> = {
  'good 2pt': 'Tir à 2 pts',
  'miss 2pt': 'Tir à 2 pts',
  'good 3pt': 'Tir à 3 pts',
  'miss 3pt': 'Tir à 3 pts',
  'good ft': 'Lancer franc',
  'miss ft': 'Lancer franc',
  assist: 'Passe décisive',
  rebound: 'Rebond',
  turnover: 'Perte de balle',
  steal: 'Interception',
  block: 'Contre',
  foul: 'Faute',
};


export default function JadeStats() {
  const [actions, setActions] = useState<MatchAction[][]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const matchLinks = [
    {
      name: 'Match du 25 Octobre 2025 🏀',
      url: 'https://goconqs.com/sports/womens-basketball/stats/2024-25/western-texas-college/boxscore/5990',
    },
  ];

  const handleMatchSelect = (value: string) => setSelectedMatch(value);

  const handleGenerate = async () => {
    if (!selectedMatch) {
      setModalMessage('Sélectionne un match 💜');
      setIsModalOpen(true);
      
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/play-analysis?url=${encodeURIComponent(selectedMatch)}`);
      const json = await res.json();
console.log("📦 Réponse brute du backend:", json);
      if (json.error) throw new Error(json.error);

      // On ne garde que les actions "Smith"
      const smithActions = (json.actions || [])
        .filter((a: MatchAction) => a.action.toLowerCase().includes('smith'))
        // On supprime les substitutions
        .filter((a) => !a.action.toLowerCase().includes('substitution'));

      // On convertit pour être compatible avec ton tableau Léna
      const formatted: MatchAction[][] = smithActions.map((a) => {
        const periodNum =
          a.period.includes('1ST') ? '1' :
          a.period.includes('2ND') ? '2' :
          a.period.includes('3RD') ? '3' :
          a.period.includes('4TH') ? '4' : '0';
        return [periodNum, a.time, a.action, a.success || '1'] as unknown as MatchAction[];
      });

      setActions(formatted);
    } catch (err) {
      console.error(err);
      setModalMessage('Erreur de récupération des données 😢');
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
       <div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-12 gap-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
       <VideoHeader className="absolute top-0 left-0 w-full" />

      <main className="flex flex-col items-center gap-6 w-full max-w-4xl mt-10">
        {/* Sélection du match */}
        <Select value={selectedMatch} onValueChange={handleMatchSelect}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Sélectionne un match" />
          </SelectTrigger>
          <SelectContent>
            {matchLinks.map((link) => (
              <SelectItem key={link.url} value={link.url}>
                {link.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bouton “Voir Stats” */}
        <Button
          onClick={handleGenerate}
          className="bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors w-full max-w-md"
        >
          VOIR STATS
        </Button>

        {/* Tableau des actions */}
        {loading ? (
          <p className="text-gray-500 text-center mt-6">Chargement des actions...</p>
        ) : actions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 w-full">
            {[1, 2, 3, 4].map((period) => (
              <Card key={period}>
                <CardContent>
                  <h3 className="text-lg font-bold text-center mt-6 mb-3 text-purple-700">
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
                      {actions
                        .filter((row: any) => row[0] === `${period}`)
                        .filter((row: any) => !row[2].toLowerCase().includes('substitution'))
                        .map((row: any, index) => {
                      

// 🧠 Nettoyage et simplification du texte brut
const raw = (row[2] || '').toLowerCase();
  // 🚫 On ignore les substitutions
      if (raw.includes('sub in') || raw.includes('sub out')) return null;

// On enlève "by smith, destinee" ou autres suffixes similaires
const cleaned = raw
  .replace(/by\s+smith.*$/i, '') // enlève "by smith..." à la fin
  .replace(/\s+/g, ' ') // espaces multiples → simple espace
  .trim();

// On cherche le mot-clé correspondant dans la phrase
let foundKey = Object.keys(actionMapping).find((key) => cleaned.includes(key));

// Traduction et statut visuel
const displayAction = foundKey ? actionMapping[foundKey] : row[2];
const isSuccess = cleaned.includes('good');
const isMiss = cleaned.includes('miss');

// Définir le statut
let status = '';
if (isSuccess) status = '✔️';
else if (isMiss) status = '❌';
else if (['turnover', 'foul'].some((k) => cleaned.includes(k))) status = '❌';
else status = '✔️';


                         

                          return (
                            <TableRow key={index}>
                              <TableCell className="text-center">{row[1]}</TableCell>
                              <TableCell className="text-center">{displayAction}</TableCell>
                              <TableCell className="text-center">
                                <span className={status === '✔️' ? 'text-green-500' : 'text-red-500'}>
                                  {status}
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
        ) : (
          selectedMatch && (
            <p className="text-gray-500 text-center mt-6">
              Aucune action trouvée pour Smith 😢
            </p>
          )
        )}
      </main>

      {/* Modal d’erreur */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[80%] max-w-xs rounded-lg shadow-lg bg-white dark:bg-gray-800 p-6">
          <DialogHeader>
            <DialogTitle className="text-center mb-4">⚠️ Erreur</DialogTitle>
            <DialogDescription className="text-center mt-4">{modalMessage}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="text-sm text-gray-900 mt-8">
        <a
          href="https://www.youtube.com/@fan_lucilej"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-purple-700"
        >
          Produit par @fan_carlaleite 💜
        </a>
      </footer>
    </div>
  );
}
