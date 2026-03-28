import { useState, useEffect } from 'react';
import { getFlamengoAnthem } from '../api/flamengoApi';

export default function FlamengoAnthemPage() {
  const [anthem, setAnthem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFlamengoAnthem()
      .then((response) => {
        setAnthem(response.data);
      })
      .catch(() => {
        setError('Nao foi possivel carregar o hino. Tente novamente mais tarde.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="anthem-page">
        <p className="anthem-loading">Carregando hino...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="anthem-page">
        <p className="anthem-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="anthem-page">
      <h1 className="anthem-title">{anthem.title}</h1>
      <p className="anthem-lyrics">{anthem.lyrics}</p>
    </div>
  );
}
