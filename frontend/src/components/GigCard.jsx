import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DollarSign, Clock, MapPin, ArrowRight, Bookmark, ExternalLink, User } from 'lucide-react';

const GigCard = ({ gig }) => {
    // Support both mock data format and backend API format
    const id = gig._id || gig.id;
    const title = gig.title;
    const description = gig.description;

    // Handle budget - backend uses budgetMin/budgetMax, mock uses budget
    const budget = gig.budgetMax || gig.budgetMin || gig.budget;
    const budgetMin = gig.budgetMin;
    const budgetMax = gig.budgetMax;

    // Handle budget type - backend uses 'fixed'/'hourly', mock uses 'project'/'hour'
    const budgetType = gig.budgetType === 'hourly' ? 'hour' :
        gig.budgetType === 'fixed' ? 'project' :
            gig.budgetType || 'project';

    const duration = gig.duration;
    const location = gig.location || 'Remote';
    const skills = gig.skills || [];

    // Handle posted time - backend uses createdAt, mock uses postedAt
    const postedAt = gig.postedAt || formatTimeAgo(gig.createdAt);

    // Handle client info - backend populates client object
    const clientName = gig.clientName || gig.client?.name || 'Anonymous Client';
    const clientAvatar = gig.clientAvatar || getAvatarEmoji(gig.category);

    function formatTimeAgo(dateString) {
        if (!dateString) return 'Just now';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    }

    function getAvatarEmoji(category) {
        const categoryEmojis = {
            'development': '💻',
            'design': '🎨',
            'writing': '✍️',
            'marketing': '📈',
            'video': '🎬',
            'devops': '☁️',
            'data': '📊',
            'consulting': '💼'
        };
        return categoryEmojis[category?.toLowerCase()] || '🏢';
    }

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + '...';
    };

    const formatBudget = () => {
        if (budgetMin && budgetMax && budgetMin !== budgetMax) {
            return `$${budgetMin.toLocaleString()} - $${budgetMax.toLocaleString()}`;
        }
        return `$${(budget || 0).toLocaleString()}`;
    };

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    };

    const badgeStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.625rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 500,
        backgroundColor: 'rgba(165, 180, 252, 0.3)',
        color: '#4338CA'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
            transition={{ duration: 0.3 }}
            style={cardStyle}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        backgroundColor: 'rgba(165, 180, 252, 0.3)',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                    }}>
                        {clientAvatar}
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-brand-black)' }}>{clientName}</p>
                        <p style={{ fontSize: '0.75rem', color: '#71717a' }}>{postedAt}</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '0.75rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        transition: 'color 0.2s'
                    }}
                >
                    <Bookmark style={{ width: '1.25rem', height: '1.25rem' }} />
                </motion.button>
            </div>

            {/* Title */}
            <h3 className="font-heading" style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-brand-black)',
                marginBottom: '0.5rem',
                lineHeight: 1.3
            }}>
                {title}
            </h3>

            {/* Description */}
            <p style={{ color: '#52525b', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.5, flex: 1 }}>
                {truncateText(description, 120)}
            </p>

            {/* Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {skills?.slice(0, 3).map((skill, index) => (
                    <span key={index} style={badgeStyle}>
                        {skill}
                    </span>
                ))}
                {skills?.length > 3 && (
                    <span style={{ ...badgeStyle, backgroundColor: '#f4f4f5', color: '#52525b' }}>
                        +{skills.length - 3}
                    </span>
                )}
            </div>

            {/* Meta Info */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#71717a', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <DollarSign style={{ width: '1rem', height: '1rem' }} />
                    <span style={{ fontWeight: 500, color: 'var(--color-brand-black)' }}>{formatBudget()}</span>
                    <span style={{ fontSize: '0.75rem' }}>/{budgetType}</span>
                </div>
                {duration && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock style={{ width: '1rem', height: '1rem' }} />
                        <span>{duration}</span>
                    </div>
                )}
                {location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin style={{ width: '1rem', height: '1rem' }} />
                        <span>{location}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #f4f4f5' }}>
                <Link to={`/gig/${id}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            fontSize: '0.875rem',
                            padding: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        View Details
                        <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                    </motion.button>
                </Link>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        border: '2px solid #e5e5e5',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border-color 0.2s'
                    }}
                >
                    <ExternalLink style={{ width: '1rem', height: '1rem', color: '#52525b' }} />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default GigCard;
