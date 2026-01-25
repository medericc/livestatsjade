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

// 🗺️ Traductions des types d’action (avec toutes les variantes)
const actionMapping: Record<string, string> = {
  // 🔹 Tirs à 2 points
  "made 2pt": "Tir à 2",
  "missed 2pt": "Tir à 2",
  "good 2pt": "Tir à 2",
  "miss 2pt": "Tir à 2",

  "made layup": "Tir à 2",
  "missed layup": "Tir à 2",
  "good layup": "Tir à 2",
  "miss layup": "Tir à 2",

  "made jumper": "Tir à 2",
  "missed jumper": "Tir à 2",
  "good jumper": "Tir à 2",
  "miss jumper": "Tir à 2",

  "made dunk": "Tir à 2",
  "missed dunk": "Tir à 2",
  "good dunk": "Tir à 2",
  "miss dunk": "Tir à 2",

  "made tip": "Tir à 2",
  "missed tip": "Tir à 2",
  "good tip": "Tir à 2",
  "miss tip": "Tir à 2",

  "made hook": "Tir à 2",
  "missed hook": "Tir à 2",
  "good hook": "Tir à 2",
  "miss hook": "Tir à 2",

  // 🔹 Tirs à 3 points
  "made 3pt": "Tir à 3",
  "missed 3pt": "Tir à 3",
  "good 3pt": "Tir à 3",
  "miss 3pt": "Tir à 3",
  "made 3-pt": "Tir à 3",
  "missed 3-pt": "Tir à 3",

  // 🔹 Lancers francs
  "made ft": "Lancer Franc",
  "missed ft": "Lancer Franc",
  "good ft": "Lancer Franc",
  "miss ft": "Lancer Franc",
  "made free throw": "Lancer Franc",
  "missed free throw": "Lancer Franc",

  // 🔹 Autres actions
  assist: "Assist",
  rebound: "Rebond",
  turnover: "Turnover",
  steal: "Steal",
  block: "Block",
  foul: "Faute",
};




export default function JadeStats() {
  const [actions, setActions] = useState<MatchAction[]>([]);

  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

   const matchLinks = [

// https://www.bartonsports.com/sports/wbkb/2025-26/boxscores/20251114_f343.xml?view=plays
//     // https://njcaastats.prestosports.com/sports/wbkb/2025-26/div1/boxscores/20251114_f343.xml?view=plays
    // 


// 60 jours
//   { name: 'Seward County', url: 'https://njcaastats.prestosports.com/sports/wbkb/2025-26/div1/boxscores/20260304_0gi5.xml?view=plays', },
//  46 jurs
//   { name: 'Fort Hays Tech', url: 'https://njcaastats.prestosports.com/sports/wbkb/2025-26/div1/boxscores/20260218_bupj.xml?view=plays', },
//  42 jours
//   { name: 'Prat CC', url: 'https://njcaastats.prestosports.com/sports/wbkb/2025-26/div1/boxscores/20260214_uu67.xml?view=plays', },
//  22 jours
  { name: 'Cowley CC', url: 'https://njcaastats.prestosports.com/sports/wbkb/2025-26/div1/boxscores/20260125_w7us.xml?view=plays', },

  { name: 'Independence CC', url: 'https://njcaastats.prestosports.com/sports/wbkb/2025-26/div1/boxscores/20260114_sj4f.xml?view=plays', },
 

  { name: 'Butler CC', url: 'https://njcaastats.prestosports.com/sports/wbkb/2025-26/div1/boxscores/20260110_rmof.xml?view=plays', },
 



    { name: 'Prat CC', url: 'https://njcaastats.prestosports.com/sports/wbkb/2025-26/div1/boxscores/20251213_0x7x.xml?view=plays', },
 
  { name: 'Colby CC', url: 'https://njcaastats.prestosports.com/sports/wbkb/2025-26/div1/boxscores/20251203_cv1p.xml?view=plays', },
   { name: 'Cowley County', url: 'https://njcaastats.prestosports.com/sports/wbkb/2025-26/div1/boxscores/20251122_v2a7.xml?view=plays', },
    {
      name: 'Barton Sport',
      url: 'https://www.bartonsports.com/sports/wbkb/2025-26/boxscores/20251119_90mc.xml?view=plays',
    },
    {
      name: 'North Platte',
      url: 'https://njcaastats.prestosports.com/sports/wbkb/2025-26/div1/boxscores/20251111_bcxa.xml?view=plays',
    },
   
  ];


  const handleMatchSelect = (value: string) => setSelectedMatch(value);

const handleGenerate = async () => {
  if (!selectedMatch || selectedMatch === 'none') {
    setModalMessage("Jade s'échauffe 🏀");
    setIsModalOpen(true);
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`/api/play-analysis?url=${encodeURIComponent(selectedMatch)}`);

    // ⛔ Erreur HTTP → modale
    if (!res.ok) {
      throw new Error(`Erreur HTTP : ${res.status}`);
    }

    const json = await res.json();
    console.log("📦 Réponse brute du backend:", json);

    // ⛔ Backend renvoie erreur → modale
    if (json.error) {
      throw new Error(json.error);
    }

    // ⛔ Aucune action trouvée → modale
    if (!json.actions || json.actions.length === 0) {
      throw new Error("Aucune donnée trouvée pour ce match");
    }

    const smithActions = (json.actions || [])
      .filter((a: MatchAction) =>
        a.action
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes('celerier')
      )
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

  } catch (err: unknown) {
    console.error(err);
    setModalMessage("Jade s'échauffe 🏀");
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

    // 💬 Nettoyage du texte
    const cleaned = raw
      .replace(/celerier.*?(made|missed|goes|enters|assist|turnover|foul|rebound|steal|block)/i, '$1')
      .trim();

    // 🎯 Détection du type d’action
    const foundKey = Object.keys(actionMapping).find((key) => cleaned.includes(key));

    // 🏷️ Libellé en français
    const displayAction = foundKey ? actionMapping[foundKey] : (() => {
      if (cleaned.includes('enters')) return 'Entrée en jeu';
      if (cleaned.includes('goes')) return 'Sortie de jeu';
      if (cleaned.includes('assist')) return 'Passe décisive';
      if (cleaned.includes('rebound')) return 'Rebond';
      if (cleaned.includes('turnover')) return 'Perte de balle';
      if (cleaned.includes('steal')) return 'Interception';
      if (cleaned.includes('foul')) return 'Faute';
      return cleaned;
    })();

    // ✅ Statut réussite / échec
    const isSuccess =
      cleaned.includes('made') || cleaned.includes('good') || cleaned.includes('assist') ||
      cleaned.includes('rebound') || cleaned.includes('steal') || cleaned.includes('block') ||
      cleaned.includes('enters') || cleaned.includes('goes');
    const isMiss =
      cleaned.includes('missed') || cleaned.includes('turnover') || cleaned.includes('foul');

    const status = isSuccess ? '✔️' : isMiss ? '❌' : '';
    const statusColor =
      status === '✔️' ? 'text-green-500' : status === '❌' ? 'text-red-500' : 'text-gray-500';

   return (
  // 🚫 On saute les lignes inutiles
  ['Entrée en jeu', 'Sortie de jeu', 'Faute'].includes(displayAction)
    ? null
    : (
      <TableRow key={index}>
        <TableCell className="text-center">{row.time}</TableCell>
        <TableCell className="text-center">{displayAction}</TableCell>
        <TableCell className={`text-center ${statusColor}`}>{status}</TableCell>
      </TableRow>
    )
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
  <DialogContent className="w-[85%] max-w-sm rounded-2xl shadow-xl bg-white p-8 text-center">
    <DialogHeader>
      <DialogTitle className="text-2xl text-center font-bold text-purple-700 mb-3">
        Patiente ⌛
      </DialogTitle>
      <DialogDescription className="text-lg text-center text-gray-800 ">
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
