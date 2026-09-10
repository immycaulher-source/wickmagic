import { useState } from "react";
import api from '../api';
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/Form.css';

function Form({ route, method }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const name = method === 'login' ? 'Login' : 'Register';
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // <-- Fix: Must be line 1 to prevent native browser reloads
        setLoading(true);

        try {
            const res = await api.post(route, { username, password });
            if (method === 'login') {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (error) {
            alert(error.response?.data?.detail || error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
          <section className="auth-card" aria-labelledby="auth-title">
            <div className="brand-mark" aria-hidden="true">W</div>
            <p className="eyebrow">WickMagic</p>
            <h1 id="auth-title">{name === 'Login' ? 'Welcome back' : 'Create your workspace'}</h1>
            <p className="auth-subtitle">{name === 'Login' ? 'Sign in to keep your thoughts organized.' : 'Start capturing your best ideas in one place.'}</p>
        <form onSubmit={handleSubmit} className="form-container">
            <label className="field-label" htmlFor="username">Username</label>
            <input
                id="username"
                className='form-input'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Username'
                required
            />
            <label className="field-label" htmlFor="password">Password</label>
            <input
                id="password"
                className='form-input'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                required
            />
            <button className="form-button" type='submit' disabled={loading}>
                {loading ? 'Processing...' : name}
            </button>

            <div className="auth-switch">
                {method === 'login' ? (
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register">
                            Create Account
                        </Link>
                    </p>
                ) : (
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">
                            Login Here
                        </Link>
                    </p>
                )}
            </div>
        </form>
        </section>
        </main>
    );
}

export default Form;
