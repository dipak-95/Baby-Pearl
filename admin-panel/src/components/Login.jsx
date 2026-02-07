import React, { useState } from 'react';
import { Baby, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_URL, ADMIN_API } from '../config/api';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${ADMIN_API}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('admin_token', data.token);
                toast.success('Welcome back!');
                onLogin();
            } else {
                toast.error(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed! Check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '40px',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <div style={{
                    background: '#ffedd5',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)'
                }}>
                    <Baby size={32} color="#f97316" />
                </div>

                <h2 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '8px'
                }}>Welcome Back</h2>

                <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                    Please login to manage photos
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={20} color="#9ca3af" style={{ position: 'absolute', top: '14px', left: '16px' }} />
                        <input
                            type="email"
                            placeholder="admin@pearl.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.2s',
                                background: '#f9fafb'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#f97316'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={20} color="#9ca3af" style={{ position: 'absolute', top: '14px', left: '16px' }} />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.2s',
                                background: '#f9fafb'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#f97316'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#f97316',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.1s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.background = '#ea580c')}
                        onMouseOut={(e) => !loading && (e.target.style.background = '#f97316')}
                        onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')}
                        onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1)')}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
