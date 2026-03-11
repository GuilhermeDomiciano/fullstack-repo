import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { acceptInvite } from '../api/workspaceApi';
import { useAuth } from '../context/AuthContext';

export default function AcceptInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');

  useEffect(() => {
    if (!user) {
      // Not authenticated — redirect to login with return path
      navigate(`/login?redirect=/invites/accept/${token}`, { replace: true });
      return;
    }

    acceptInvite(token)
      .then((res) => {
        setWorkspaceName(res.data.workspace?.name || '');
        setMessage(res.data.message || 'You have joined the workspace.');
        setStatus('success');
        // Redirect to workspace after 2 seconds
        setTimeout(() => {
          navigate(`/workspaces/${res.data.workspace?.id}`, { replace: true });
        }, 2000);
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message || 'Failed to accept the invite.';
        setMessage(msg);
        setStatus('error');
      });
  }, [token, user, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Workspace Invite</h1>

        {status === 'loading' && (
          <p className="auth-subtitle">Accepting invite, please wait...</p>
        )}

        {status === 'success' && (
          <>
            <div className="alert alert-success" role="alert">
              {message}
              {workspaceName && (
                <strong> Workspace: {workspaceName}</strong>
              )}
            </div>
            <p className="auth-subtitle">Redirecting to your workspace...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="alert alert-error" role="alert">
              {message}
            </div>
            <p className="auth-footer">
              <Link to="/workspaces">Go to my workspaces</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
