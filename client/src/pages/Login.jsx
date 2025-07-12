import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';

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
      illustrationAlt="Login Illustration"
      illustrationSrc="https://undraw.co/api/illustrations/7b7a3b4b-7c3b-4d5e-b1e2-4b7c4e4b4e4b"
      belowForm={
        <>Don't have an account? <a href="/register" className="auth-link">Sign Up</a></>
      }
    >
      <form onSubmit={handleSubmit}>
        <input name="username" type="email" placeholder="Email" value={form.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <div className="auth-row">
          <label className="remember-me"><input type="checkbox" /> Remember me</label>
          <a href="#" className="forgot-link">Forgot Password?</a>
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Sign In'}</button>
        {error && <div className="form-error">{error}</div>}
      </form>
    </AuthLayout>
  );
};

export default Login;
