import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-brand">FusionRun</h1>
        <div className="header-actions">
          <span className="header-user">{user?.name}</span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Welcome, {user?.name}!</h2>
          <p className="welcome-email">{user?.email}</p>
          <p className="welcome-note">
            You are authenticated. Your session is active and your token is
            stored securely in localStorage.
          </p>
          <Link to="/workspaces" className="btn btn-outline ws-dashboard-link">
            View my Workspaces
          </Link>
        </div>

        <div className="user-details-card">
          <h3>Account details</h3>
          <dl className="detail-list">
            <dt>ID</dt>
            <dd>{user?.id}</dd>
            <dt>Name</dt>
            <dd>{user?.name}</dd>
            <dt>Email</dt>
            <dd>{user?.email}</dd>
            <dt>Member since</dt>
            <dd>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : '--'}
            </dd>
          </dl>
        </div>
      </main>
    </div>
  );
}
