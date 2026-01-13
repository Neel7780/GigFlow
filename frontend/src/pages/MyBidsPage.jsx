import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Clock,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowRight,
    RefreshCw
} from 'lucide-react';
import api from '../api/axios';
import { useSelector } from 'react-redux';

const MyBidsPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    // Redirect clients - only freelancers have bids
    useEffect(() => {
        if (user && user.role === 'client') {
            navigate('/dashboard', {
                state: { error: 'Only freelancers can view submitted proposals.' }
            });
        }
    }, [user, navigate]);

    const fetchBids = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/bids/my');
            setBids(response.data.bids || []);
        } catch (err) {
            console.error('Failed to fetch bids:', err);
            setError(err.response?.data?.error || 'Failed to load your bids.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBids();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'hired':
                return (
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '9999px',
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    }}>
                        <CheckCircle style={{ width: '0.875rem', height: '0.875rem' }} />
                        Hired!
                    </span>
                );
            case 'rejected':
                return (
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '9999px',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    }}>
                        <XCircle style={{ width: '0.875rem', height: '0.875rem' }} />
                        Not Selected
                    </span>
                );
            default:
                return (
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '9999px',
                        backgroundColor: '#fef3c7',
                        color: '#b45309',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    }}>
                        <Clock style={{ width: '0.875rem', height: '0.875rem' }} />
                        Pending
                    </span>
                );
        }
    };

    const filteredBids = activeTab === 'all'
        ? bids
        : bids.filter(bid => bid.status === activeTab);

    const tabs = [
        { id: 'all', label: 'All', count: bids.length },
        { id: 'pending', label: 'Pending', count: bids.filter(b => b.status === 'pending').length },
        { id: 'hired', label: 'Hired', count: bids.filter(b => b.status === 'hired').length },
        { id: 'rejected', label: 'Not Selected', count: bids.filter(b => b.status === 'rejected').length }
    ];

    return (
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2rem' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="font-heading" style={{
                            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                            fontWeight: 700,
                            color: 'var(--color-brand-black)',
                            marginBottom: '0.5rem'
                        }}>
                            My <span className="font-accent" style={{ fontStyle: 'italic', color: 'var(--color-brand-orange)' }}>Proposals</span>
                        </h1>
                        <p style={{ color: '#52525b' }}>
                            Track the status of your submitted proposals
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchBids}
                        disabled={loading}
                        style={{
                            padding: '0.75rem 1.25rem',
                            borderRadius: '0.75rem',
                            backgroundColor: 'white',
                            border: '2px solid #e5e5e5',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 500,
                            opacity: loading ? 0.5 : 1
                        }}
                    >
                        <RefreshCw style={{
                            width: '1rem',
                            height: '1rem',
                            animation: loading ? 'spin 1s linear infinite' : 'none'
                        }} />
                        Refresh
                    </motion.button>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    overflowX: 'auto',
                    paddingBottom: '0.5rem'
                }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.625rem 1.25rem',
                            borderRadius: '9999px',
                            border: activeTab === tab.id ? 'none' : '1px solid #e5e5e5',
                            backgroundColor: activeTab === tab.id ? 'var(--color-brand-black)' : 'white',
                            color: activeTab === tab.id ? 'white' : '#52525b',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                        <span style={{
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : '#f4f4f5',
                            fontSize: '0.75rem'
                        }}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </motion.div>

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        padding: '1rem 1.5rem',
                        borderRadius: '0.75rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}
                >
                    <AlertCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                    {error}
                </motion.div>
            )}

            {/* Loading State */}
            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{
                            backgroundColor: 'white',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            border: '1px solid #e5e5e5'
                        }}>
                            <div style={{ height: '1.5rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem', width: '50%', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }} />
                            <div style={{ height: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem', width: '80%', marginBottom: '0.5rem', animation: 'pulse 1.5s infinite' }} />
                            <div style={{ height: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem', width: '60%', animation: 'pulse 1.5s infinite' }} />
                        </div>
                    ))}
                    <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
                </div>
            )}

            {/* Bids List */}
            {!loading && filteredBids.length > 0 && (
                <AnimatePresence>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredBids.map((bid, index) => (
                            <motion.div
                                key={bid._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    border: bid.status === 'hired' ? '2px solid #22c55e' : '1px solid #e5e5e5',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => bid.gigId?._id && navigate(`/gig/${bid.gigId._id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <Briefcase style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-brand-orange)' }} />
                                            <h3 style={{
                                                fontWeight: 600,
                                                color: 'var(--color-brand-black)',
                                                fontSize: '1.125rem'
                                            }}>
                                                {bid.gigId?.title || 'Gig Unavailable'}
                                            </h3>
                                        </div>

                                        <p style={{
                                            color: '#52525b',
                                            fontSize: '0.875rem',
                                            marginBottom: '0.75rem',
                                            lineHeight: 1.5,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {bid.message}
                                        </p>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: '#71717a' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <DollarSign style={{ width: '1rem', height: '1rem' }} />
                                                Your bid: <span style={{ fontWeight: 600, color: 'var(--color-brand-black)' }}>${bid.price?.toLocaleString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <Clock style={{ width: '1rem', height: '1rem' }} />
                                                {new Date(bid.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                                        {getStatusBadge(bid.status)}

                                        {bid.gigId?.budget && (
                                            <p style={{ fontSize: '0.875rem', color: '#71717a' }}>
                                                Budget: <span style={{ fontWeight: 600 }}>${bid.gigId.budget.toLocaleString()}</span>
                                            </p>
                                        )}

                                        <button
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.375rem',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '0.5rem',
                                                backgroundColor: 'transparent',
                                                border: '1px solid #e5e5e5',
                                                color: '#52525b',
                                                fontSize: '0.875rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                bid.gigId?._id && navigate(`/gig/${bid.gigId._id}`);
                                            }}
                                        >
                                            View Gig
                                            <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                                        </button>
                                    </div>
                                </div>

                                {bid.status === 'hired' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        style={{
                                            marginTop: '1rem',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid #e5e5e5',
                                            backgroundColor: '#f0fdf4',
                                            margin: '1rem -1.5rem -1.5rem -1.5rem',
                                            padding: '1rem 1.5rem',
                                            borderRadius: '0 0 1rem 1rem'
                                        }}
                                    >
                                        <p style={{ color: '#15803d', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />
                                            Congratulations! You've been hired for this project.
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            )}

            {/* Empty State */}
            {!loading && filteredBids.length === 0 && !error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '4rem 1rem' }}
                >
                    <Briefcase style={{ width: '4rem', height: '4rem', color: '#d4d4d4', margin: '0 auto 1rem' }} />
                    <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-black)', marginBottom: '0.5rem' }}>
                        {activeTab === 'all' ? 'No proposals yet' : `No ${activeTab} proposals`}
                    </h3>
                    <p style={{ color: '#52525b', marginBottom: '1.5rem' }}>
                        {activeTab === 'all'
                            ? 'Start applying to gigs to see your proposals here'
                            : 'No proposals match this filter'}
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn-primary"
                        style={{ padding: '0.75rem 1.5rem' }}
                    >
                        Find Gigs
                    </button>
                </motion.div>
            )}

            {/* Spin animation for refresh button */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default MyBidsPage;
