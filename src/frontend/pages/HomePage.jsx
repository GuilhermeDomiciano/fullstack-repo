import HealthCheck from '../components/HealthCheck';
import styles from './HomePage.module.css';

function HomePage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Fullstack App</h1>
      <HealthCheck />
    </main>
  );
}

export default HomePage;
