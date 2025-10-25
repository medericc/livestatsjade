// app/pages.tsx
'use client';

import { useEffect, useState } from 'react';

export default function PlayAnalysisPage() {
  const [data, setData] = useState<string[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/play-analysis');
        const json = await res.json();
        setData(json.playAnalysis || []);
      } catch (err) {
        console.error('Erreur de chargement :', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Play Analysis</h1>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          maxWidth: '900px',
          background: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #ddd',
                      fontSize: '0.9rem',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  color: '#888',
                }}
              >
                Chargement des données...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
