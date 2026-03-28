import { useEffect, useState } from 'react';
import { getFlamengo } from '../api/flamengoApi';

export default function FlamengoPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFlamengo()
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        setError('Não foi possível carregar o Hino do Flamengo. Tente novamente mais tarde.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flamengo-page">
        <p className="flamengo-loading">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flamengo-page">
        <p className="flamengo-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="flamengo-page">
      <h1 className="flamengo-title">{data.nome}</h1>
      <p className="flamengo-letra">{data.letra}</p>
    </div>
  );
}
