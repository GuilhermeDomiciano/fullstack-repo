import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getWorkspace, createInvite, removeMember } from '../api/workspaceApi';
import { useAuth } from '../context/AuthContext';

export default function WorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteResult, setInviteResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const [removingId, setRemovingId] = useState(null);
  const [removeError, setRemoveError] = useState('');

  const loadWorkspace = useCallback(() => {
    setLoading(true);
    setError('');
    getWorkspace(id)
      .then((res) => setWorkspace(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setError('You do not have access to this workspace.');
        } else if (err.response?.status === 404) {
          setError('Workspace not found.');
        } else {
          setError('Failed to load workspace. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  async function handleGenerateInvite(e) {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError('');
    setInviteResult(null);
    setCopied(false);

    try {
      const res = await createInvite(id, { email: inviteEmail || undefined });
      setInviteResult(res.data);
      setInviteEmail('');
    } catch (err) {
      if (err.response) {
        setInviteError(err.response.data?.message || 'Failed to generate invite.');
      } else {
        setInviteError('Unable to reach the server.');
      }
    } finally {
      setInviteLoading(false);
    }
  }

  function handleCopy() {
    if (!inviteResult?.invite_url) return;
    navigator.clipboard.writeText(inviteResult.invite_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleRemoveMember(memberId) {
    if (!window.confirm('Remove this member from the workspace?')) return;
    setRemovingId(memberId);
    setRemoveError('');

    try {
      await removeMember(id, memberId);
      setWorkspace((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.id !== memberId),
      }));
    } catch (err) {
      if (err.response) {
        setRemoveError(err.response.data?.message || 'Failed to remove member.');
      } else {
        setRemoveError('Unable to reach the server.');
      }
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <header className="dashboard-header">
          <h1 className="dashboard-brand">FusionRun</h1>
          <Link to="/workspaces" className="btn btn-outline">
            Back to workspaces
          </Link>
        </header>
        <main className="dashboard-main">
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        </main>
      </div>
    );
  }

  const isOwner = workspace?.owner?.id === user?.id;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-brand">FusionRun</h1>
        <Link to="/workspaces" className="btn btn-outline">
          Back to workspaces
        </Link>
      </header>

      <main className="dashboard-main">
        {/* Workspace info */}
        <div className="welcome-card">
          <div className="ws-detail-heading">
            <h2>{workspace.name}</h2>
            <span className={`ws-badge ws-badge-${workspace.role}`}>{workspace.role}</span>
          </div>
          {workspace.description && (
            <p className="welcome-note">{workspace.description}</p>
          )}
          <p className="welcome-email">
            Owner: {workspace.owner.name} ({workspace.owner.email})
          </p>
        </div>

        {/* Invite section */}
        <div className="user-details-card">
          <h3>Invite members</h3>
          <p className="ws-section-note">
            Generate a link to invite someone. The link expires in 7 days.
          </p>

          {inviteError && (
            <div className="alert alert-error" role="alert">
              {inviteError}
            </div>
          )}

          <form onSubmit={handleGenerateInvite} className="invite-form">
            <div className="form-group">
              <label htmlFor="invite-email">Email (optional)</label>
              <input
                id="invite-email"
                name="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                disabled={inviteLoading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary invite-btn"
              disabled={inviteLoading}
            >
              {inviteLoading ? 'Generating...' : 'Generate Invite Link'}
            </button>
          </form>

          {inviteResult && (
            <div className="invite-result">
              <p className="invite-label">Share this link:</p>
              <div className="invite-link-row">
                <input
                  type="text"
                  readOnly
                  value={inviteResult.invite_url}
                  className="invite-link-input"
                  onFocus={(e) => e.target.select()}
                />
                <button className="btn btn-outline copy-btn" onClick={handleCopy}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {inviteResult.expires_at && (
                <p className="invite-expires">
                  Expires: {new Date(inviteResult.expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Members list */}
        <div className="user-details-card">
          <h3>Members ({workspace.members.length})</h3>

          {removeError && (
            <div className="alert alert-error" role="alert">
              {removeError}
            </div>
          )}

          <ul className="members-list">
            {workspace.members.map((member) => (
              <li key={member.id} className="member-row">
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-email">{member.email}</span>
                </div>
                <div className="member-actions">
                  <span className={`ws-badge ws-badge-${member.role}`}>{member.role}</span>
                  {isOwner && member.id !== user?.id && (
                    <button
                      className="btn btn-danger-sm"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={removingId === member.id}
                    >
                      {removingId === member.id ? 'Removing...' : 'Remove'}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
