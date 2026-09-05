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
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className='form-input'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Username'
                required
            />
            <input
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

            {/* Toggle link between Login and Register */}
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                {method === 'login' ? (
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                            Create Account
                        </Link>
                    </p>
                ) : (
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                            Login Here
                        </Link>
                    </p>
                )}
            </div>
        </form>
    );
}

export default Form;