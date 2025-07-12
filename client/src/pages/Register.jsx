import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const { register, loading } = useAppContext();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username and password are required.');
      return;
    }

    const ok = await register(form.username, form.password);
    if (ok) {
      navigate('/login');
    } else {
      setError('Username already exists');
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to join the StackIt community"
      illustrationAlt="Register Illustration"
      illustrationSrc="https://undraw.co/api/illustrations/7b7a3b4b-7c3b-4d5e-b1e2-4b7c4e4b4e4b"
      belowForm={
        <>Already have an account? <a href="/login" className="auth-link">Sign In</a></>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="username"
          type="email"
          placeholder="Email"
          value={form.username}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
        {error && <div className="form-error">{error}</div>}
      </form>
    </AuthLayout>
  );
};

export default Register;
