import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    PenTool,
    DollarSign,
    Clock,
    Tag,
    FileText,
    Plus,
    X,
    Send,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import api from '../api/axios';
import { useSelector } from 'react-redux';

const skillSuggestions = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Figma',
    'UI/UX', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'SEO',
    'Content Writing', 'Video Editing', 'Motion Graphics', 'Branding'
];

const PostJobPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        budgetMin: '',
        budgetMax: '',
        budgetType: 'project',
        duration: '',
        skills: []
    });
    const [skillInput, setSkillInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Redirect freelancers - only clients can post jobs
    useEffect(() => {
        if (user && user.role === 'freelancer') {
            navigate('/dashboard', {
                state: { error: 'Only clients can post jobs. Switch to a client account to hire talent.' }
            });
        }
    }, [user, navigate]);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                const data = response.data;
                setCategories(data.categories || data.data || data || []);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
                // Fallback to default categories if API fails
                setCategories([
                    { _id: 'development', name: 'Development' },
                    { _id: 'design', name: 'Design' },
                    { _id: 'writing', name: 'Writing & Content' },
                    { _id: 'marketing', name: 'Marketing' },
                    { _id: 'video', name: 'Video & Animation' },
                    { _id: 'data', name: 'Data & Analytics' },
                    { _id: 'consulting', name: 'Consulting' },
                    { _id: 'other', name: 'Other' }
                ]);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        if (error) setError(null);
    };

    const addSkill = (skill) => {
        if (skill && !formData.skills.includes(skill) && formData.skills.length < 10) {
            setFormData({
                ...formData,
                skills: [...formData.skills, skill]
            });
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Map duration values to match backend expectations
            const durationMap = {
                'less-than-week': '1 week',
                '1-2-weeks': '1-2 weeks',
                '2-4-weeks': '2-4 weeks',
                '1-3-months': '1-3 months',
                '3-6-months': '3-6 months',
                'ongoing': 'Ongoing'
            };

            // Prepare payload for backend
            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                budgetMin: parseInt(formData.budgetMin, 10),
                budgetMax: parseInt(formData.budgetMax, 10),
                budgetType: formData.budgetType === 'hour' ? 'hourly' : 'fixed',
                duration: durationMap[formData.duration] || formData.duration,
                skills: formData.skills
            };

            await api.post('/gigs', payload);

            // Success - navigate to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to create gig:', err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to post gig. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        marginBottom: '1.5rem'
    };

    const sectionHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem'
    };

    const iconBoxStyle = (bgColor) => ({
        width: '2.5rem',
        height: '2.5rem',
        backgroundColor: bgColor,
        borderRadius: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    });

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        border: '2px solid #e5e5e5',
        borderRadius: '0.75rem',
        fontSize: '1rem',
        backgroundColor: 'white',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    const textareaStyle = {
        ...inputStyle,
        resize: 'none',
        minHeight: '8rem'
    };

    const categoryButtonStyle = (isSelected) => ({
        padding: '0.75rem 1rem',
        borderRadius: '0.75rem',
        border: `2px solid ${isSelected ? 'var(--color-brand-orange)' : '#e5e5e5'}`,
        backgroundColor: isSelected ? 'rgba(255, 107, 74, 0.05)' : 'white',
        color: isSelected ? 'var(--color-brand-orange)' : '#52525b',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'center'
    });

    const budgetTypeButtonStyle = (isSelected) => ({
        padding: '0.75rem 1.5rem',
        borderRadius: '0.75rem',
        border: `2px solid ${isSelected ? 'var(--color-brand-orange)' : '#e5e5e5'}`,
        backgroundColor: isSelected ? 'rgba(255, 107, 74, 0.05)' : 'white',
        color: isSelected ? 'var(--color-brand-orange)' : '#52525b',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
        flex: 1
    });

    return (
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '2.5rem' }}
            >
                <div
                    className="badge-mint"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(134, 239, 172, 0.3)',
                        color: '#15803d'
                    }}
                >
                    <Sparkles style={{ width: '1rem', height: '1rem' }} />
                    Post a New Gig
                </div>
                <h1 className="font-heading" style={{
                    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                    fontWeight: 700,
                    color: 'var(--color-brand-black)',
                    marginBottom: '0.75rem'
                }}>
                    Find the <span className="font-accent" style={{ fontStyle: 'italic', color: 'var(--color-brand-orange)' }}>perfect</span> talent
                </h1>
                <p style={{ color: '#52525b' }}>
                    Create a detailed job post to attract the best freelancers
                </p>
            </motion.div>

            {/* Error Message */}
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
                    <AlertCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
                    <span>{error}</span>
                </motion.div>
            )}

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
            >
                {/* Job Title */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBoxStyle('rgba(255, 107, 74, 0.1)')}>
                            <PenTool style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-brand-orange)' }} />
                        </div>
                        <div>
                            <h2 className="font-heading" style={{ fontWeight: 600, color: 'var(--color-brand-black)', fontSize: '1rem' }}>Job Title</h2>
                            <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Make it clear and descriptive</p>
                        </div>
                    </div>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Build a Modern E-commerce Website with React"
                        style={inputStyle}
                        required
                    />
                </div>

                {/* Category */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBoxStyle('rgba(165, 180, 252, 0.3)')}>
                            <Tag style={{ width: '1.25rem', height: '1.25rem', color: '#6366f1' }} />
                        </div>
                        <div>
                            <h2 className="font-heading" style={{ fontWeight: 600, color: 'var(--color-brand-black)', fontSize: '1rem' }}>Category</h2>
                            <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Select the most relevant category</p>
                        </div>
                    </div>
                    {loadingCategories ? (
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} style={{
                                    height: '2.5rem',
                                    width: '8rem',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '0.75rem',
                                    animation: 'pulse 1.5s infinite'
                                }} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                            {categories.map((category) => (
                                <motion.button
                                    key={category._id || category.name}
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setFormData({ ...formData, category: category._id || category.name })}
                                    style={categoryButtonStyle(formData.category === (category._id || category.name))}
                                >
                                    {category.name}
                                </motion.button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Description */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBoxStyle('rgba(134, 239, 172, 0.3)')}>
                            <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a' }} />
                        </div>
                        <div>
                            <h2 className="font-heading" style={{ fontWeight: 600, color: 'var(--color-brand-black)', fontSize: '1rem' }}>Description</h2>
                            <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Describe your project in detail</p>
                        </div>
                    </div>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Include project requirements, deliverables, and any specific skills needed..."
                        rows={6}
                        style={textareaStyle}
                        required
                    />
                    <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.5rem' }}>
                        {formData.description.length}/2000 characters
                    </p>
                </div>

                {/* Skills */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBoxStyle('rgba(168, 85, 247, 0.1)')}>
                            <Tag style={{ width: '1.25rem', height: '1.25rem', color: '#9333ea' }} />
                        </div>
                        <div>
                            <h2 className="font-heading" style={{ fontWeight: 600, color: 'var(--color-brand-black)', fontSize: '1rem' }}>Required Skills</h2>
                            <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Add up to 10 skills</p>
                        </div>
                    </div>

                    {/* Added Skills */}
                    {formData.skills.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {formData.skills.map((skill) => (
                                <motion.span
                                    key={skill}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="badge-periwinkle"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.875rem',
                                        backgroundColor: 'rgba(165, 180, 252, 0.3)',
                                        color: '#4338CA'
                                    }}
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            display: 'flex',
                                            color: '#4338CA'
                                        }}
                                    >
                                        <X style={{ width: '0.875rem', height: '0.875rem' }} />
                                    </button>
                                </motion.span>
                            ))}
                        </div>
                    )}

                    {/* Skill Input */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addSkill(skillInput);
                                }
                            }}
                            placeholder="Type a skill and press Enter"
                            style={{ ...inputStyle, flex: 1 }}
                        />
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addSkill(skillInput)}
                            className="btn-secondary"
                            style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
                        </motion.button>
                    </div>

                    {/* Skill Suggestions */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {skillSuggestions
                            .filter(s => !formData.skills.includes(s))
                            .slice(0, 8)
                            .map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => addSkill(skill)}
                                    style={{
                                        fontSize: '0.75rem',
                                        padding: '0.375rem 0.75rem',
                                        backgroundColor: '#f4f4f5',
                                        color: '#52525b',
                                        borderRadius: '9999px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    + {skill}
                                </button>
                            ))}
                    </div>
                </div>

                {/* Budget */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBoxStyle('rgba(250, 204, 21, 0.2)')}>
                            <DollarSign style={{ width: '1.25rem', height: '1.25rem', color: '#ca8a04' }} />
                        </div>
                        <div>
                            <h2 className="font-heading" style={{ fontWeight: 600, color: 'var(--color-brand-black)', fontSize: '1rem' }}>Budget</h2>
                            <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Set your budget range</p>
                        </div>
                    </div>

                    {/* Budget Type */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormData({ ...formData, budgetType: 'project' })}
                            style={budgetTypeButtonStyle(formData.budgetType === 'project')}
                        >
                            Fixed Price
                        </motion.button>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormData({ ...formData, budgetType: 'hour' })}
                            style={budgetTypeButtonStyle(formData.budgetType === 'hour')}
                        >
                            Hourly Rate
                        </motion.button>
                    </div>

                    {/* Budget Range */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-brand-black)', fontSize: '0.875rem' }}>
                                Min Budget ($)
                            </label>
                            <input
                                type="number"
                                name="budgetMin"
                                value={formData.budgetMin}
                                onChange={handleChange}
                                placeholder="500"
                                style={inputStyle}
                                required
                                min="1"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-brand-black)', fontSize: '0.875rem' }}>
                                Max Budget ($)
                            </label>
                            <input
                                type="number"
                                name="budgetMax"
                                value={formData.budgetMax}
                                onChange={handleChange}
                                placeholder="2000"
                                style={inputStyle}
                                required
                                min="1"
                            />
                        </div>
                    </div>
                </div>

                {/* Duration */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBoxStyle('rgba(59, 130, 246, 0.1)')}>
                            <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />
                        </div>
                        <div>
                            <h2 className="font-heading" style={{ fontWeight: 600, color: 'var(--color-brand-black)', fontSize: '1rem' }}>Duration</h2>
                            <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Expected project timeline</p>
                        </div>
                    </div>
                    <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                        required
                    >
                        <option value="">Select duration</option>
                        <option value="less-than-week">Less than 1 week</option>
                        <option value="1-2-weeks">1-2 weeks</option>
                        <option value="2-4-weeks">2-4 weeks</option>
                        <option value="1-3-months">1-3 months</option>
                        <option value="3-6-months">3-6 months</option>
                        <option value="ongoing">Ongoing</option>
                    </select>
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{
                        width: '100%',
                        padding: '1.25rem 2rem',
                        fontSize: '1.125rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        opacity: isSubmitting ? 0.5 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <div style={{
                                width: '1.5rem',
                                height: '1.5rem',
                                border: '2px solid white',
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                            Posting...
                        </>
                    ) : (
                        <>
                            <Send style={{ width: '1.25rem', height: '1.25rem' }} />
                            Post Gig
                        </>
                    )}
                </motion.button>
            </motion.form>

            {/* Keyframe animation for spinner */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default PostJobPage;
