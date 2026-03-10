import React, { useState } from 'react';
import { login } from '../api';

const Login = ({ setAuth }) => {
    const [formData, setFormData] = useState({ username: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(formData);

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('user', data.username);

            setAuth(data);
            window.location.href = "/";
        } catch (err) {
            setError(err.response?.data?.msg || "Login Failed");
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>🔐 Admin Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setFormData({ username: e.target.value })}
                />

                {error && <p style={{color: 'red'}}>{error}</p>}

                <button className="btn-egg" type="submit">
                    Unlock Admin Access
                </button>
            </form>
        </div>
    );
};

export default Login;