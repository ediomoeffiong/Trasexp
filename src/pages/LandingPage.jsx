import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="container nav-container">
                    <div className="nav-logo">Monetraq</div>
                    <div className="nav-actions">
                        {user ? (
                            <>
                                <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
                                <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/auth/login" className="btn btn-ghost">Log In</Link>
                                <Link to="/auth/register" className="btn btn-primary">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Track Your Expenses <br />
                            <span className="text-gradient">Master Your Money</span>
                        </h1>
                        <p className="hero-subtitle">
                            The smartest way to manage your personal finances. Track spending, visualize habits, and reach your financial goals with Monetraq.
                        </p>
                        <div className="hero-actions">
                            <Link to="/auth/register" className="btn btn-lg btn-primary">Start Tracking Now</Link>
                            <a href="#features" className="btn btn-lg btn-outline">Learn More</a>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="hero-glass-card">
                            <div className="floating-icon icon-1">💰</div>
                            <div className="floating-icon icon-2">📊</div>
                            <div className="floating-icon icon-3">💳</div>
                            <div className="mockup-placeholder">
                                {/* Abstract visual or mockup */}
                                <div className="chart-preview"></div>
                                <div className="balance-preview"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Why Choose Monetraq?</h2>
                        <p className="section-subtitle">Everything you need to take control of your financial life.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Instant Tracking</h3>
                            <p>Log your income and expenses in seconds. Clean, fast, and intuitive interface.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Visual Insights</h3>
                            <p>Understand your spending habits with beautiful charts and monthly summaries.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Secure & Private</h3>
                            <p>Your financial data is yours alone. Securely stored and never shared.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Mobile Friendly</h3>
                            <p>Access your dashboard from anywhere, on any device. Fully responsive design.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">How It Works</h2>
                    </div>

                    <div className="steps-container">
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <h3>Sign Up</h3>
                            <p>Create your free account in less than a minute.</p>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-item">
                            <div className="step-number">2</div>
                            <h3>Add Transactions</h3>
                            <p>Record your daily spending and income sources.</p>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-item">
                            <div className="step-number">3</div>
                            <h3>Analyze & Grow</h3>
                            <p>Review your dashboard and optimize your budget.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container text-center">
                    <h2>Ready to take control?</h2>
                    <p>Join thousands of users improving their financial health today.</p>
                    <Link to="/auth/register" className="btn btn-lg btn-white">Create Free Account</Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="nav-logo">Monetraq</div>
                            <p>Making personal finance simple and accessible for everyone.</p>
                        </div>
                        <div className="footer-links">
                            <h4>Product</h4>
                            <a href="#">Features</a>
                            <a href="#">Pricing</a>
                            <a href="#">Roadmap</a>
                        </div>
                        <div className="footer-links">
                            <h4>Company</h4>
                            <a href="#">About</a>
                            <a href="#">Careers</a>
                            <a href="#">Contact</a>
                        </div>
                        <div className="footer-links">
                            <h4>Legal</h4>
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                            <a href="#">Security</a>
                        </div>
                    </div>
                    <div className="footer-bottom text-center">
                        <p>&copy; {new Date().getFullYear()} Monetraq. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
