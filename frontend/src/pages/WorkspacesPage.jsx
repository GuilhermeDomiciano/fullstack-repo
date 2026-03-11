import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWorkspaces, createWorkspace } from '../api/workspaceApi';
import { useAuth } from '../context/AuthContext';

export default function WorkspacesPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [workspaces, setWorkspaces] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formGlobalError, setFormGlobalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadWorkspaces = useCallback(() => {
    setLoadingList(true);
    setListError('');
    getWorkspaces()
      .then((res) => setWorkspaces(res.data))
      .catch(() => setListError('Failed to load workspaces. Please try again.'))
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setFormGlobalError('');
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});
    setFormGlobalError('');

    try {
      const res = await createWorkspace(form);
      setWorkspaces((prev) => [res.data, ...prev]);
      setShowForm(false);
      setForm({ name: '', description: '' });
      navigate(`/workspaces/${res.data.id}`);
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 422 && data.errors) {
          setFormErrors(data.errors);
        } else {
          setFormGlobalError(data.message || 'An unexpected error occurred.');
        }
      } else {
        setFormGlobalError('Unable to reach the server. Please check your connection.');
      }
    } finally {
      setSubmitting(false);
    }
  }

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

      <main className="dashboard-main workspace-list-main">
        <div className="ws-list-header">
          <h2 className="ws-list-title">My Workspaces</h2>
          <button
            className="btn btn-primary ws-create-btn"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? 'Cancel' : '+ New Workspace'}
          </button>
        </div>

        {showForm && (
          <div className="ws-form-card">
            <h3 className="ws-form-title">Create Workspace</h3>
            {formGlobalError && (
              <div className="alert alert-error" role="alert">
                {formGlobalError}
              </div>
            )}
            <form onSubmit={handleCreate} noValidate>
              <div className="form-group">
                <label htmlFor="ws-name">Name</label>
                <input
                  id="ws-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className={formErrors.name ? 'input-error' : ''}
                  placeholder="My Awesome Team"
                  disabled={submitting}
                />
                {formErrors.name && (
                  <span className="field-error">{formErrors.name[0]}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="ws-description">Description</label>
                <input
                  id="ws-description"
                  name="description"
                  type="text"
                  value={form.description}
                  onChange={handleChange}
                  className={formErrors.description ? 'input-error' : ''}
                  placeholder="Optional description"
                  disabled={submitting}
                />
                {formErrors.description && (
                  <span className="field-error">{formErrors.description[0]}</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Workspace'}
              </button>
            </form>
          </div>
        )}

        {listError && (
          <div className="alert alert-error" role="alert">
            {listError}
          </div>
        )}

        {loadingList ? (
          <div className="loading-screen">
            <p>Loading workspaces...</p>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="ws-empty">
            <p>You have no workspaces yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="ws-grid">
            {workspaces.map((ws) => (
              <Link key={ws.id} to={`/workspaces/${ws.id}`} className="ws-card">
                <div className="ws-card-header">
                  <span className="ws-card-name">{ws.name}</span>
                  <span className={`ws-badge ws-badge-${ws.role}`}>{ws.role}</span>
                </div>
                {ws.description && (
                  <p className="ws-card-desc">{ws.description}</p>
                )}
                <p className="ws-card-members">
                  {ws.members.length} member{ws.members.length !== 1 ? 's' : ''}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
