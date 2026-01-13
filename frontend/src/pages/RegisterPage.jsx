import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Rocket, User, Briefcase } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'freelancer'
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(registerUser(formData));
        if (registerUser.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    const inputWrapperStyle = {
        position: 'relative',
        width: '100%'
    };

    const iconStyle = {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1.25rem',
        height: '1.25rem',
        color: '#9ca3af',
        pointerEvents: 'none'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem 0.875rem 3rem',
        border: '2px solid #e5e5e5',
        borderRadius: '0.75rem',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
        backgroundColor: 'white',
        outline: 'none'
    };

    const passwordInputStyle = {
        ...inputStyle,
        paddingRight: '3rem'
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 6rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1.5rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '28rem' }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <div style={{
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: 'var(--color-brand-orange)',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Rocket style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                        </div>
                    </Link>
                    <h1 className="font-heading" style={{ marginTop: '1.5rem', fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-brand-black)' }}>
                        Create an account
                    </h1>
                    <p style={{ marginTop: '0.5rem', color: '#52525b' }}>
                        Join GigFlow and start your journey
                    </p>
                </div>

                {/* Register Card */}
                <div className="card">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    backgroundColor: '#fef2f2',
                                    color: '#dc2626',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.75rem',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Name Field */}
                        <div>
                            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-brand-black)' }}>
                                Full Name
                            </label>
                            <div style={inputWrapperStyle}>
                                <User style={iconStyle} />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-brand-black)' }}>
                                Email Address
                            </label>
                            <div style={inputWrapperStyle}>
                                <Mail style={iconStyle} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-brand-black)' }}>
                                Password
                            </label>
                            <div style={inputWrapperStyle}>
                                <Lock style={iconStyle} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                    style={passwordInputStyle}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#9ca3af',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {showPassword ?
                                        <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> :
                                        <Eye style={{ width: '1.25rem', height: '1.25rem' }} />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--color-brand-black)' }}>
                                I want to
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '0.75rem',
                                        border: `2px solid ${formData.role === 'freelancer' ? 'var(--color-brand-orange)' : '#e5e5e5'}`,
                                        backgroundColor: formData.role === 'freelancer' ? 'rgba(255, 107, 74, 0.05)' : 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <User style={{
                                        width: '1.5rem',
                                        height: '1.5rem',
                                        color: formData.role === 'freelancer' ? 'var(--color-brand-orange)' : '#9ca3af'
                                    }} />
                                    <span style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: formData.role === 'freelancer' ? 'var(--color-brand-orange)' : '#52525b'
                                    }}>
                                        Find Work
                                    </span>
                                </motion.button>

                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setFormData({ ...formData, role: 'client' })}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '0.75rem',
                                        border: `2px solid ${formData.role === 'client' ? 'var(--color-brand-orange)' : '#e5e5e5'}`,
                                        backgroundColor: formData.role === 'client' ? 'rgba(255, 107, 74, 0.05)' : 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Briefcase style={{
                                        width: '1.5rem',
                                        height: '1.5rem',
                                        color: formData.role === 'client' ? 'var(--color-brand-orange)' : '#9ca3af'
                                    }} />
                                    <span style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: formData.role === 'client' ? 'var(--color-brand-orange)' : '#52525b'
                                    }}>
                                        Hire Talent
                                    </span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Terms */}
                        <p style={{ fontSize: '0.75rem', color: '#71717a' }}>
                            By creating an account, you agree to our{' '}
                            <a href="#" style={{ color: 'var(--color-brand-orange)', textDecoration: 'none' }}>Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" style={{ color: 'var(--color-brand-orange)', textDecoration: 'none' }}>Privacy Policy</a>
                        </p>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                opacity: loading ? 0.5 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? (
                                <div style={{
                                    width: '1.25rem',
                                    height: '1.25rem',
                                    border: '2px solid white',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }} />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>




                {/* Login Link */}
                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#52525b' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--color-brand-orange)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </p>
            </motion.div>

            {/* Keyframe animation for spinner */}
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default RegisterPage;
