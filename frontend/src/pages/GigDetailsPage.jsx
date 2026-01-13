import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    DollarSign,
    Clock,
    MapPin,
    Calendar,
    User,
    CheckCircle,
    Share2,
    Flag,
    ArrowLeft,
    Send
} from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../api/axios';

const GigDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bidMessage, setBidMessage] = useState('');
    const [bidPrice, setBidPrice] = useState('');
    const [submittingBid, setSubmittingBid] = useState(false);
    const [bidSuccess, setBidSuccess] = useState(false);

    useEffect(() => {
        const fetchGig = async () => {
            try {
                const response = await api.get(`/gigs/${id}`);
                setGig(response.data.gig);
            } catch (err) {
                console.error('Failed to fetch gig details:', err);
                setError(err.response?.data?.message || 'Failed to load gig details.');
            } finally {
                setLoading(false);
            }
        };

        fetchGig();
    }, [id]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        setSubmittingBid(true);
        try {
            await api.post('/bids', {
                gigId: id,
                price: Number(bidPrice),
                message: bidMessage
            });
            setBidSuccess(true);
            setBidMessage('');
            setBidPrice('');
            // Refresh gig data to show updated status if needed, 
            // or just rely on the success message state
        } catch (err) {
            console.error('Failed to submit bid:', err);
            alert(err.response?.data?.message || 'Failed to submit bid. Please try again.');
        } finally {
            setSubmittingBid(false);
        }
    };

    const formatBudget = (gig) => {
        if (gig.budgetMin && gig.budgetMax) {
            return `$${gig.budgetMin.toLocaleString()} - $${gig.budgetMax.toLocaleString()}`;
        }
        return `$${(gig.budget || 0).toLocaleString()}`;
    };

    const isOwner = user && gig && user.id === gig.ownerId._id;

    if (loading) {
        return (
            <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
                <div style={{ height: '3rem', backgroundColor: '#f0f0f0', borderRadius: '0.75rem', marginBottom: '1rem', width: '60%', animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: '1.5rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem', marginBottom: '2rem', width: '40%', animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: '20rem', backgroundColor: '#f0f0f0', borderRadius: '1.5rem', animation: 'pulse 1.5s infinite' }} />
                <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
            </div>
        );
    }

    if (error || !gig) {
        return (
            <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Gig Not Found</h2>
                <p style={{ color: '#52525b', marginBottom: '1.5rem' }}>{error || "The gig you're looking for doesn't exist or has been removed."}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-primary"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#71717a',
                    fontWeight: 500
                }}
            >
                <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
                Back to Gigs
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span className="badge-periwinkle" style={{
                                padding: '0.375rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                backgroundColor: 'rgba(165, 180, 252, 0.3)',
                                color: '#4338CA',
                                fontWeight: 500
                            }}>
                                {gig.categoryId?.name || 'General'}
                            </span>
                            {gig.status === 'open' ? (
                                <span style={{
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'rgba(134, 239, 172, 0.3)',
                                    color: '#15803d',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#15803d' }} />
                                    Open for Bids
                                </span>
                            ) : (
                                <span style={{
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    backgroundColor: '#f3f4f6',
                                    color: '#4b5563',
                                    fontWeight: 500
                                }}>
                                    Closed
                                </span>
                            )}
                        </div>

                        <h1 className="font-heading" style={{
                            fontSize: '2.25rem',
                            fontWeight: 700,
                            color: 'var(--color-brand-black)',
                            marginBottom: '1rem',
                            lineHeight: 1.2
                        }}>
                            {gig.title}
                        </h1>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#52525b', fontSize: '0.875rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar style={{ width: '1rem', height: '1rem' }} />
                                Posted {new Date(gig.createdAt).toLocaleDateString()}
                            </div>
                            {gig.duration && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock style={{ width: '1rem', height: '1rem' }} />
                                    {gig.duration}
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin style={{ width: '1rem', height: '1rem' }} />
                                Remote
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: 'white', borderRadius: '1.5rem', border: '1px solid #e5e5e5' }}>
                        <h2 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Project Description</h2>
                        <p style={{ color: '#52525b', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                            {gig.description}
                        </p>
                    </div>

                    {/* Skills */}
                    {gig.skills && gig.skills.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Required Skills</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {gig.skills.map((skill, index) => (
                                    <span key={index} style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e5e5',
                                        borderRadius: '9999px',
                                        color: '#52525b',
                                        fontSize: '0.875rem'
                                    }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ position: 'sticky', top: '100px' }}
                >
                    {/* Budget Card */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '1.5rem',
                        padding: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        border: '1px solid #e5e5e5',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.875rem', color: '#71717a', marginBottom: '0.25rem' }}>Budget</p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-brand-black)' }}>
                                    {formatBudget(gig)}
                                </span>
                                <span style={{ color: '#71717a', fontSize: '0.875rem' }}>
                                    {gig.budgetType === 'hourly' ? '/ hr' : 'fixed'}
                                </span>
                            </div>
                        </div>

                        {!isOwner && gig.status === 'open' && (
                            <>
                                {bidSuccess ? (
                                    <div style={{
                                        backgroundColor: '#ecfdf5',
                                        border: '1px solid #a7f3d0',
                                        borderRadius: '0.75rem',
                                        padding: '1rem',
                                        textAlign: 'center'
                                    }}>
                                        <CheckCircle style={{ width: '2rem', height: '2rem', color: '#059669', margin: '0 auto 0.5rem auto' }} />
                                        <h4 style={{ color: '#064e3b', fontWeight: 600, marginBottom: '0.25rem' }}>Bid Submitted!</h4>
                                        <p style={{ color: '#065f46', fontSize: '0.875rem' }}>The client will be notified of your proposal.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleBidSubmit}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Submit a Proposal</h3>

                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Your Bid Amount ($)</label>
                                            <div style={{ position: 'relative' }}>
                                                <DollarSign style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                                                <input
                                                    type="number"
                                                    value={bidPrice}
                                                    onChange={(e) => setBidPrice(e.target.value)}
                                                    min="1"
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 0.75rem 0.75rem 2.25rem',
                                                        borderRadius: '0.75rem',
                                                        border: '2px solid #e5e5e5',
                                                        fontSize: '1rem'
                                                    }}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Cover Letter</label>
                                            <textarea
                                                value={bidMessage}
                                                onChange={(e) => setBidMessage(e.target.value)}
                                                required
                                                rows={4}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem',
                                                    borderRadius: '0.75rem',
                                                    border: '2px solid #e5e5e5',
                                                    fontSize: '0.875rem',
                                                    resize: 'vertical'
                                                }}
                                                placeholder="Explain why you're the best fit for this job..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submittingBid}
                                            className="btn-primary"
                                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        >
                                            {submittingBid ? 'Sending...' : <>Send Proposal <Send style={{ width: '1rem', height: '1rem' }} /></>}
                                        </button>
                                    </form>
                                )}
                            </>
                        )}
                    </div>

                    {/* Client Info */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid #e5e5e5' }}>
                        <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>About the Client</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {gig.ownerId?.avatar ? (
                                    <img src={gig.ownerId.avatar} alt={gig.ownerId.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <User style={{ width: '1.5rem', height: '1.5rem', color: '#9ca3af' }} />
                                )}
                            </div>
                            <div>
                                <p style={{ fontWeight: 600, color: 'var(--color-brand-black)' }}>{gig.ownerId?.name || 'Anonymous'}</p>
                                <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Member since {new Date(gig.ownerId?.createdAt || Date.now()).getFullYear()}</p>
                            </div>
                        </div>
                        {/* 
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#52525b' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle style={{ width: '1rem', height: '1rem', color: 'var(--color-brand-orange)' }} />
                                Payment Verified
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Flag style={{ width: '1rem', height: '1rem', color: 'var(--color-brand-orange)' }} />
                                {gig.ownerId?.location || 'Unknown Location'}
                            </div>
                        </div>
                        */}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GigDetailsPage;
