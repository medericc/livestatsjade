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
  'good layup': 'Tir à 2 pts',
  'miss layup': 'Tir à 2 pts',
  'good jumper': 'Tir à 2 pts',
  'miss jumper': 'Tir à 2 pts',
  'good dunk': 'Tir à 2 pts',
  'miss dunk': 'Tir à 2 pts',
  'good tip': 'Tir à 2 pts',
  'miss tip': 'Tir à 2 pts',
  'good hook': 'Tir à 2 pts',
  'miss hook': 'Tir à 2 pts',
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
  const [actions, setActions] = useState<MatchAction[]>([]);

  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const matchLinks = [
    {
      name: 'Salt Lake',
      url: '',
    },
    //  {
    //   name: 'Salt Lake',
    //   url: 'https://goconqs.com/sports/womens-basketball/stats/2024-25/western-texas-college/boxscore/5990',
    // },
  
  ];

  const handleMatchSelect = (value: string) => setSelectedMatch(value);

 const handleGenerate = async () => {
  // 💡 Si aucun match sélectionné ou URL vide
  if (!selectedMatch || selectedMatch.trim() === "") {
    setModalMessage("Jade s’échauffe 🏀");
    setIsModalOpen(true);
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`/api/play-analysis?url=${encodeURIComponent(selectedMatch)}`);
    const json = await res.json();
    console.log("📦 Réponse brute du backend:", json);
    if (json.error) throw new Error(json.error);

    // On filtre uniquement les actions de Shorna
    const smithActions = (json.actions || [])
      .filter((a: MatchAction) => a.action.toLowerCase().includes('shorna'))
      .filter((a: MatchAction) => !a.action.toLowerCase().includes('substitution'));

    const formatted: MatchAction[] = smithActions.map((a: MatchAction) => {
      const p = a.period.toUpperCase();
      const periodNum =
        /1(ST)?/.test(p) ? '1' :
        /2(ND)?/.test(p) ? '2' :
        /3(RD)?/.test(p) ? '3' :
        /4(TH)?/.test(p) ? '4' : '0';

      return {
        period: periodNum,
        time: a.time,
        action: a.action,
        success: a.success || '',
      };
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
<div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-12 gap-8 bg-white text-gray-900">
<VideoHeader className="absolute top-0 left-0 w-full" />

      <main className="flex flex-col items-center gap-6 w-full max-w-4xl mt-10">
        {/* Sélection du match */}
      <Select value={selectedMatch} onValueChange={handleMatchSelect}>
  <SelectTrigger className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-sm text-gray-900">
    <SelectValue placeholder="Sélectionne un match" />
  </SelectTrigger>
  <SelectContent 
    className="bg-white border border-gray-300 rounded-lg shadow-md text-black w-[var(--radix-select-trigger-width)]"
  >
    {matchLinks.map((link) => (
       <SelectItem
        key={link.url}
        value={link.url}
        className="py-1 px-2 text-sm" // 👈 réduit la hauteur
      >   {link.name}
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
              <Card key={period} className="bg-white rounded-lg shadow-md">
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
  .filter((row) => row.period === `${period}`)
  .filter((row) => !row.action.toLowerCase().includes('substitution'))
  .map((row, index) => {
    const raw = (row.action || '').toLowerCase();
    if (raw.includes('sub in') || raw.includes('sub out')) return null;

    const cleaned = raw
      .replace(/by\s+shorna.*$/i, '')
      .replace(/\s+/g, ' ')
      .trim();

    const foundKey = Object.keys(actionMapping).find((key) => cleaned.includes(key));
    const displayAction = foundKey ? actionMapping[foundKey] : row.action;
    const isSuccess = cleaned.includes('good');
    const isMiss = cleaned.includes('miss');
    let status = '';

    if (isSuccess) status = '✔️';
    else if (isMiss) status = '❌';
    else if (['turnover', 'foul'].some((k) => cleaned.includes(k))) status = '❌';
    else status = '✔️';

    return (
      <TableRow key={index}>
        <TableCell className="text-center">{row.time}</TableCell>
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
              Sélectionne un match, maynat !
            </p>
          )
        )}
      </main>

      {/* Modal d’erreur */}
 <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="w-[85%] max-w-sm rounded-2xl shadow-xl bg-white dark:bg-gray-800 p-8 text-center">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-purple-700 mb-3">
        Patiente 💜
      </DialogTitle>
      <DialogDescription className="text-lg text-gray-800 dark:text-gray-200">
        {modalMessage}
      </DialogDescription>
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
