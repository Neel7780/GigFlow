import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, SlidersHorizontal, X, RefreshCw } from 'lucide-react';
import GigCard from '../components/GigCard';
import api from '../api/axios';

const categories = [
    'All',
    'Development',
    'Design',
    'Writing',
    'Marketing',
    'Video',
    'DevOps'
];

const DashboardPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    // API state
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    // Fetch gigs from API
    const fetchGigs = async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', '12');

            if (searchQuery) {
                params.append('search', searchQuery);
            }

            if (selectedCategory !== 'All') {
                params.append('category', selectedCategory);
            }

            const response = await api.get(`/gigs?${params.toString()}`);
            const data = response.data;

            setGigs(data.gigs || data.data || []);
            setPagination({
                page: data.page || page,
                totalPages: data.totalPages || 1,
                total: data.total || 0
            });
        } catch (err) {
            console.error('Failed to fetch gigs:', err);
            setError(err.response?.data?.message || 'Failed to load gigs. Please try again.');
            setGigs([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch gigs on mount and when filters change
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchGigs(1);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, selectedCategory]);

    const handleLoadMore = () => {
        if (pagination.page < pagination.totalPages) {
            fetchGigs(pagination.page + 1);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem 0.875rem 3rem',
        border: '2px solid #e5e5e5',
        borderRadius: '0.75rem',
        fontSize: '1rem',
        backgroundColor: 'white',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    const categoryButtonStyle = (isSelected) => ({
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        border: isSelected ? 'none' : '1px solid #e5e5e5',
        backgroundColor: isSelected ? 'var(--color-brand-black)' : 'white',
        color: isSelected ? 'white' : '#52525b',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap'
    });

    const filterCardStyle = {
        backgroundColor: 'white',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        marginBottom: '1.5rem'
    };

    const selectStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '2px solid #e5e5e5',
        borderRadius: '0.75rem',
        fontSize: '0.875rem',
        backgroundColor: 'white',
        outline: 'none',
        cursor: 'pointer'
    };

    // Loading skeleton
    const SkeletonCard = () => (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            padding: '1.5rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(0, 0, 0, 0.04)'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ height: '1.5rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem', width: '80%', animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem', width: '100%', animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.5rem', width: '60%', animation: 'pulse 1.5s infinite' }} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{ height: '1.5rem', backgroundColor: '#f0f0f0', borderRadius: '9999px', width: '4rem', animation: 'pulse 1.5s infinite' }} />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
            {/* Keyframe animation for skeleton */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2rem' }}
            >
                <h1 className="font-heading" style={{
                    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                    fontWeight: 700,
                    color: 'var(--color-brand-black)',
                    marginBottom: '0.5rem'
                }}>
                    Find <span className="font-accent" style={{ fontStyle: 'italic', color: 'var(--color-brand-orange)' }}>amazing</span> gigs
                </h1>
                <p style={{ color: '#52525b' }}>
                    Discover projects that match your skills and interests
                </p>
            </motion.div>

            {/* Search & Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ marginBottom: '2rem' }}
            >
                {/* Search Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                            <Search style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '1.25rem',
                                height: '1.25rem',
                                color: '#9ca3af',
                                pointerEvents: 'none'
                            }} />
                            <input
                                type="text"
                                placeholder="Search for gigs, skills, or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowFilters(!showFilters)}
                                className={showFilters ? '' : 'btn-secondary'}
                                style={{
                                    padding: '0.875rem 1.5rem',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    backgroundColor: showFilters ? 'var(--color-brand-black)' : 'white',
                                    color: showFilters ? 'white' : 'var(--color-brand-black)',
                                    border: showFilters ? 'none' : '2px solid var(--color-brand-black)'
                                }}
                            >
                                <SlidersHorizontal style={{ width: '1.25rem', height: '1.25rem' }} />
                                Filters
                            </motion.button>
                            <div style={{
                                display: 'flex',
                                backgroundColor: 'white',
                                borderRadius: '0.75rem',
                                border: '2px solid #e5e5e5',
                                padding: '0.25rem'
                            }}>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    style={{
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        border: 'none',
                                        backgroundColor: viewMode === 'grid' ? 'var(--color-brand-black)' : 'transparent',
                                        color: viewMode === 'grid' ? 'white' : '#71717a',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Grid style={{ width: '1.25rem', height: '1.25rem' }} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    style={{
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        border: 'none',
                                        backgroundColor: viewMode === 'list' ? 'var(--color-brand-black)' : 'transparent',
                                        color: viewMode === 'list' ? 'white' : '#71717a',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <List style={{ width: '1.25rem', height: '1.25rem' }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={filterCardStyle}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 className="font-heading" style={{ fontWeight: 600, color: 'var(--color-brand-black)' }}>Filter Options</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X style={{ width: '1.25rem', height: '1.25rem', color: '#71717a' }} />
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-brand-black)', fontSize: '0.875rem' }}>
                                    Budget Range
                                </label>
                                <select style={selectStyle}>
                                    <option>Any Budget</option>
                                    <option>Under $500</option>
                                    <option>$500 - $1,000</option>
                                    <option>$1,000 - $5,000</option>
                                    <option>$5,000+</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-brand-black)', fontSize: '0.875rem' }}>
                                    Duration
                                </label>
                                <select style={selectStyle}>
                                    <option>Any Duration</option>
                                    <option>Less than 1 week</option>
                                    <option>1-2 weeks</option>
                                    <option>2-4 weeks</option>
                                    <option>1+ month</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-brand-black)', fontSize: '0.875rem' }}>
                                    Experience Level
                                </label>
                                <select style={selectStyle}>
                                    <option>Any Level</option>
                                    <option>Entry Level</option>
                                    <option>Intermediate</option>
                                    <option>Expert</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Categories */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(category)}
                            style={categoryButtonStyle(selectedCategory === category)}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Results Count */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <p style={{ color: '#52525b' }}>
                    {loading ? 'Loading...' : (
                        <>Showing <span style={{ fontWeight: 600, color: 'var(--color-brand-black)' }}>{gigs.length}</span> of {pagination.total} gigs</>
                    )}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fetchGigs(1)}
                        disabled={loading}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'white',
                            border: '1px solid #e5e5e5',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: loading ? 0.5 : 1
                        }}
                    >
                        <RefreshCw style={{
                            width: '1rem',
                            height: '1rem',
                            color: '#71717a',
                            animation: loading ? 'spin 1s linear infinite' : 'none'
                        }} />
                    </motion.button>
                    <select style={{
                        fontSize: '0.875rem',
                        backgroundColor: 'white',
                        border: '1px solid #e5e5e5',
                        borderRadius: '0.5rem',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer'
                    }}>
                        <option>Most Recent</option>
                        <option>Highest Budget</option>
                        <option>Lowest Budget</option>
                    </select>
                </div>
            </div>

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
                        justifyContent: 'space-between'
                    }}
                >
                    <span>{error}</span>
                    <button
                        onClick={() => fetchGigs(1)}
                        style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        Retry
                    </button>
                </motion.div>
            )}

            {/* Loading State */}
            {loading && (
                <div style={{
                    display: 'grid',
                    gap: '1.5rem',
                    gridTemplateColumns: viewMode === 'grid'
                        ? 'repeat(auto-fill, minmax(320px, 1fr))'
                        : '1fr'
                }}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {/* Gig Grid */}
            {!loading && gigs.length > 0 && (
                <div style={{
                    display: 'grid',
                    gap: '1.5rem',
                    gridTemplateColumns: viewMode === 'grid'
                        ? 'repeat(auto-fill, minmax(320px, 1fr))'
                        : '1fr'
                }}>
                    {gigs.map((gig, index) => (
                        <motion.div
                            key={gig._id || gig.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <GigCard gig={gig} />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && gigs.length === 0 && !error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '4rem 1rem' }}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                    <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-black)', marginBottom: '0.5rem' }}>
                        No gigs found
                    </h3>
                    <p style={{ color: '#52525b', marginBottom: '1.5rem' }}>
                        Try adjusting your search or filters to find more opportunities
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                        }}
                        className="btn-secondary"
                        style={{ padding: '0.75rem 1.5rem' }}
                    >
                        Clear Filters
                    </button>
                </motion.div>
            )}

            {/* Load More */}
            {!loading && gigs.length > 0 && pagination.page < pagination.totalPages && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLoadMore}
                        className="btn-secondary"
                        style={{ padding: '0.875rem 2rem' }}
                    >
                        Load More Gigs
                    </motion.button>
                </div>
            )}

            {/* Spin animation */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default DashboardPage;
