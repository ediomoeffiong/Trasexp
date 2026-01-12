import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData); // Simulate login
        navigate('/dashboard');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">Trasexp</Link>
                    <h2>Welcome Back</h2>
                    <p>Log in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div className="label-row">
                            <label htmlFor="password">Password</label>
                            <a href="#" className="forgot-password">Forgot?</a>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                        Log In
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/auth/register">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
