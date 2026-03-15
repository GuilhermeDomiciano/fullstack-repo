import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHinoFlamengo } from '../api/hinoApi';

export default function HinoFlamengoPage() {
  const [hino, setHino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getHinoFlamengo()
      .then((res) => setHino(res.data))
      .catch(() => setError('Nao foi possivel carregar o hino. Tente novamente.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-screen">Carregando hino...</div>;
  }

  return (
    <div className="hino-page">
      <header className="dashboard-header">
        <h1 className="dashboard-brand">FusionRun</h1>
        <Link to="/dashboard" className="btn btn-outline">
          Voltar
        </Link>
      </header>

      <main className="hino-main">
        {error && <div className="alert alert-error">{error}</div>}

        {hino && (
          <div className="hino-card">
            <div className="hino-header">
              <h2 className="hino-title">{hino.titulo}</h2>
              <p className="hino-compositor">Composicao: {hino.compositor}</p>
            </div>

            <div className="hino-letra">
              {hino.estrofes.map((estrofe, i) => (
                <p key={i} className="hino-estrofe">
                  {estrofe.versos.map((verso, j) => (
                    <span key={j}>
                      {verso}
                      {j < estrofe.versos.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
