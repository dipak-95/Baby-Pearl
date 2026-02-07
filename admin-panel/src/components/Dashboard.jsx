import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Image, Users, Calendar, TrendingUp, Baby, Sparkles } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        boys: 0,
        girls: 0,
        months: 0,
        festivals: 0,
        professional: 0,
        active: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/photos');
            const photos = res.data;

            setStats({
                total: photos.length,
                boys: photos.filter(p => p.gender === 'boy').length,
                girls: photos.filter(p => p.gender === 'girl').length,
                months: photos.filter(p => p.type === 'month').length,
                festivals: photos.filter(p => p.type === 'festival').length,
                professional: photos.filter(p => p.type === 'professional').length,
                active: photos.filter(p => p.status === 'active').length
            });
        } catch (err) {
            console.error(err);
        }
    };

    const statCards = [
        {
            label: 'Total Photos',
            value: stats.total,
            icon: <Image size={28} color="white" />,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            bgColor: '#f0f4ff'
        },
        {
            label: 'Boy Photos',
            value: stats.boys,
            icon: <Baby size={28} color="white" />,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            bgColor: '#e0f7ff'
        },
        {
            label: 'Girl Photos',
            value: stats.girls,
            icon: <Sparkles size={28} color="white" />,
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            bgColor: '#fff0f5'
        },
        {
            label: 'Month Milestones',
            value: stats.months,
            icon: <Calendar size={28} color="white" />,
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            bgColor: '#e0fff9'
        },
        {
            label: 'Festival Photos',
            value: stats.festivals,
            icon: <Sparkles size={28} color="white" />,
            gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            bgColor: '#fff5e6'
        },
        {
            label: 'Professional',
            value: stats.professional,
            icon: <Sparkles size={28} color="white" />,
            gradient: 'linear-gradient(135deg, #FFD6E8 0%, #C9A0DC 100%)',
            bgColor: '#fff0f8'
        },
        {
            label: 'Active Photos',
            value: stats.active,
            icon: <TrendingUp size={28} color="white" />,
            gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
            bgColor: '#e6fff0'
        }
    ];

    return (
        <div className="animate-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p style={{ color: 'var(--gray-600)', marginTop: '8px', fontSize: '15px' }}>
                        Welcome back! Here's an overview of your photo gallery
                    </p>
                </div>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="stat-card"
                        style={{
                            animation: `slideIn 0.4s ease-out ${index * 0.1}s both`,
                            background: stat.bgColor
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: stat.gradient
                        }}></div>

                        <div className="stat-header">
                            <div>
                                <div className="stat-value" style={{
                                    background: stat.gradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    {stat.value}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                            <div className="stat-icon" style={{ background: stat.gradient }}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{
                background: 'white',
                padding: '32px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                marginTop: '32px'
            }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--gray-900)' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <a
                        href="/photos/add"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '16px 32px',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: 'var(--shadow-md)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Image size={20} />
                        Upload New Photo
                    </a>
                    <a
                        href="/photos"
                        style={{
                            background: 'white',
                            color: 'var(--gray-700)',
                            padding: '16px 32px',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '2px solid var(--gray-300)',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'var(--gray-50)';
                            e.currentTarget.style.borderColor = 'var(--gray-400)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = 'var(--gray-300)';
                        }}
                    >
                        <Users size={20} />
                        View All Photos
                    </a>
                </div>
            </div>
        </div>
    );
}
