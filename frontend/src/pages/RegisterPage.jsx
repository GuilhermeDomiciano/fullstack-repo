import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setGlobalError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGlobalError('');

    try {
      const res = await registerUser(form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 422 && data.errors) {
          setErrors(data.errors);
        } else {
          setGlobalError(data.message || 'An unexpected error occurred. Please try again.');
        }
      } else {
        setGlobalError('Unable to reach the server. Please check your connection.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">
          Fill in the details below to get started.
        </p>

        {globalError && (
          <div className="alert alert-error" role="alert">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              placeholder="Jane Doe"
              disabled={submitting}
            />
            {errors.name && (
              <span className="field-error">{errors.name[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="jane@example.com"
              disabled={submitting}
            />
            {errors.email && (
              <span className="field-error">{errors.email[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              placeholder="Min. 8 characters"
              disabled={submitting}
            />
            {errors.password && (
              <span className="field-error">{errors.password[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirm password</label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              value={form.password_confirmation}
              onChange={handleChange}
              className={errors.password_confirmation ? 'input-error' : ''}
              placeholder="Repeat your password"
              disabled={submitting}
            />
            {errors.password_confirmation && (
              <span className="field-error">{errors.password_confirmation[0]}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
