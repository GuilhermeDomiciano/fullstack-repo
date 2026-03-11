import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import styles from './HealthCheck.module.css';

function HealthCheck() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/health')
      .then((response) => {
        if (response.success) {
          setHealth(response.data);
        } else {
          setError(response.error?.message || 'Service is not healthy');
        }
      })
      .catch(() => {
        setError('Unable to reach the backend API');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.container}>Checking backend connectivity...</div>;
  }

  if (error) {
    return (
      <div className={`${styles.container} ${styles.error}`}>
        <h2>Backend Unreachable</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${styles.healthy}`}>
      <h2>Backend Status</h2>
      <ul className={styles.list}>
        <li>
          <span className={styles.label}>Status:</span>
          <span className={styles.value}>{health.status}</span>
        </li>
        <li>
          <span className={styles.label}>Version:</span>
          <span className={styles.value}>{health.version}</span>
        </li>
        <li>
          <span className={styles.label}>Environment:</span>
          <span className={styles.value}>{health.environment}</span>
        </li>
        <li>
          <span className={styles.label}>Timestamp:</span>
          <span className={styles.value}>{health.timestamp}</span>
        </li>
      </ul>
    </div>
  );
}

export default HealthCheck;
