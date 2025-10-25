'use client';

import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VideoHeader from './components/VideoHeader';

interface MatchAction {
  period: string;
  time: string;
  action: string;
  player?: string;
}

export default function Page() {
  const [actions, setActions] = useState<MatchAction[]>([]);
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

  const handleMatchSelect = async (url: string) => {
    setSelectedMatch(url);
    setLoading(true);

    try {
      // Appel dynamique
      const res = await fetch(`/api/play-analysis?url=${encodeURIComponent(url)}`);
      const json = await res.json();

      if (json.error) throw new Error(json.error);

      // On ne garde que les actions contenant "Smith"
      const onlySmith = (json.actions || []).filter((a: MatchAction) =>
        a.action.toLowerCase().includes('smith')
      );

      setActions(onlySmith);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setModalMessage('Erreur de récupération des données 😢');
      setIsModalOpen(true);
      setLoading(false);
    }
  };

  const grouped = actions.reduce((acc, act) => {
    if (!acc[act.period]) acc[act.period] = [];
    acc[act.period].push(act);
    return acc;
  }, {} as Record<string, MatchAction[]>);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-12 gap-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <VideoHeader className="absolute top-0 left-0 w-full" />

      <main className="flex flex-col items-center gap-6 w-full max-w-lg sm:max-w-2xl md:max-w-4xl">
        {/* Sélection du match */}
        <Select value={selectedMatch} onValueChange={handleMatchSelect}>
          <SelectTrigger className="w-full">
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

        {/* Tableau Smith */}
        {loading ? (
          <p className="text-gray-500 text-center mt-6">Chargement des actions...</p>
        ) : actions.length > 0 ? (
          Object.entries(grouped).map(([period, list]) => (
            <div key={period} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 w-full">
              <h2 className="text-xl font-semibold mb-3 border-b pb-1">
                {period} QUARTER — Smith
              </h2>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-1 px-2">Temps</th>
                    <th className="py-1 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((a, i) => (
                    <tr key={i} className="border-b border-gray-300 dark:border-gray-700">
                      <td className="py-1 px-2 w-20">{a.time}</td>
                      <td className="py-1 px-2">{a.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          selectedMatch && (
            <p className="text-gray-500 text-center mt-6">
              Aucune action trouvée pour Smith 😢
            </p>
          )
        )}
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[80%] max-w-xs rounded-lg shadow-lg bg-white dark:bg-gray-800 p-6">
          <DialogHeader>
            <DialogTitle className="text-center mb-4">⚠️ Erreur</DialogTitle>
            <DialogDescription className="text-center mt-4">{modalMessage}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <footer className="text-sm text-gray-900 mt-8">
        <a
          href="https://www.youtube.com/@fan_lucilej"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Produit par @fan_carlaleite 💜
        </a>
      </footer>
    </div>
  );
}
