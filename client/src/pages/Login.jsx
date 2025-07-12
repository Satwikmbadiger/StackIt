import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const { currentUser, login, loading } = useAppContext();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (currentUser) {
    navigate('/');
    return null;
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate input before submitting
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username and password are required.');
      return;
    }
    const ok = await login(form.username, form.password);
    if (ok) navigate('/');
    else setError('Invalid credentials');
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="username" type="email" placeholder="Email" value={form.username} onChange={handleChange} required className="auth-input" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="auth-input" />
        <div className="auth-row">
          <label className="remember-me"><input type="checkbox" /> Remember me</label>
          <a href="#" className="forgot-link">Forgot Password?</a>
        </div>
        <button type="submit" disabled={loading} className="auth-btn">{loading ? 'Logging in...' : 'Sign In'}</button>
        {error && <div className="form-error">{error}</div>}
      </form>
    </AuthLayout>
  );
};

export default Login;
