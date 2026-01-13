import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Briefcase, PenTool, LogIn, Rocket, Bell, LogOut, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import useWebSocket from '../hooks/useWebSocket';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { unreadCount } = useWebSocket();

    const navLinks = [
        { name: 'Find Work', path: '/dashboard', icon: Briefcase },
        { name: 'Post Job', path: '/post-job', icon: PenTool },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        await dispatch(logoutUser());
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
                position: 'fixed',
                top: '1rem',
                left: 0,
                right: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                zIndex: 50,
                width: '95%',
                maxWidth: '64rem'
            }}
        >
            <nav
                className="glass-strong"
                style={{
                    borderRadius: '9999px',
                    padding: '0.75rem 1.5rem',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                        style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            backgroundColor: 'var(--color-brand-orange)',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Rocket style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                    </motion.div>
                    <span className="font-heading" style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-brand-black)' }}>
                        Gig<span style={{ color: 'var(--color-brand-orange)' }}>Flow</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div style={{ display: 'none', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none',
                                backgroundColor: isActive(link.path) ? 'var(--color-brand-black)' : 'transparent',
                                color: isActive(link.path) ? 'white' : 'var(--color-brand-black)'
                            }}
                        >
                            <link.icon style={{ width: '1rem', height: '1rem' }} />
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth Buttons / User Menu */}
                <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-auth">
                    {isAuthenticated ? (
                        <>
                            {/* Notification Bell */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    position: 'relative',
                                    padding: '0.5rem',
                                    borderRadius: '0.75rem',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#52525b'
                                }}
                            >
                                <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '0',
                                        right: '0',
                                        width: '1rem',
                                        height: '1rem',
                                        backgroundColor: 'var(--color-brand-orange)',
                                        color: 'white',
                                        fontSize: '0.625rem',
                                        fontWeight: 700,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </motion.button>

                            {/* User Menu */}
                            <div style={{ position: 'relative' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '9999px',
                                        backgroundColor: 'var(--color-brand-black)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 500
                                    }}
                                >
                                    <User style={{ width: '1rem', height: '1rem' }} />
                                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {user?.name || 'User'}
                                    </span>
                                </motion.button>

                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                right: 0,
                                                marginTop: '0.5rem',
                                                backgroundColor: 'white',
                                                borderRadius: '1rem',
                                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                                                padding: '0.5rem',
                                                minWidth: '160px',
                                                zIndex: 100
                                            }}
                                        >
                                            <button
                                                onClick={handleLogout}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.75rem 1rem',
                                                    borderRadius: '0.75rem',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#dc2626',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500,
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <LogOut style={{ width: '1rem', height: '1rem' }} />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                <LogIn style={{ width: '1rem', height: '1rem' }} />
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary" style={{ fontSize: '0.875rem', textDecoration: 'none' }}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="mobile-menu-btn"
                    style={{
                        padding: '0.5rem',
                        borderRadius: '0.75rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'block'
                    }}
                >
                    {isOpen ? <X style={{ width: '1.5rem', height: '1.5rem' }} /> : <Menu style={{ width: '1.5rem', height: '1.5rem' }} />}
                </motion.button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="glass-strong mobile-menu"
                        style={{
                            marginTop: '0.75rem',
                            borderRadius: '1.5rem',
                            padding: '1rem',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        borderRadius: '1rem',
                                        fontWeight: 500,
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        textDecoration: 'none',
                                        backgroundColor: isActive(link.path) ? 'var(--color-brand-black)' : 'transparent',
                                        color: isActive(link.path) ? 'white' : 'var(--color-brand-black)'
                                    }}
                                >
                                    <link.icon style={{ width: '1.25rem', height: '1.25rem' }} />
                                    {link.name}
                                </Link>
                            ))}

                            <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #e5e5e5' }} />

                            {isAuthenticated ? (
                                <>
                                    <div style={{
                                        padding: '0.75rem 1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        color: 'var(--color-brand-black)'
                                    }}>
                                        <User style={{ width: '1.25rem', height: '1.25rem' }} />
                                        <span style={{ fontWeight: 500 }}>{user?.name || 'User'}</span>
                                        {unreadCount > 0 && (
                                            <span style={{
                                                marginLeft: 'auto',
                                                width: '1.5rem',
                                                height: '1.5rem',
                                                backgroundColor: 'var(--color-brand-orange)',
                                                color: 'white',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: '1rem',
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            color: '#dc2626',
                                            backgroundColor: '#fef2f2',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <LogOut style={{ width: '1.25rem', height: '1.25rem' }} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: '1rem',
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            textDecoration: 'none',
                                            color: 'var(--color-brand-black)'
                                        }}
                                    >
                                        <LogIn style={{ width: '1.25rem', height: '1.25rem' }} />
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="btn-primary"
                                        style={{ textAlign: 'center', marginTop: '0.5rem', textDecoration: 'none' }}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CSS for responsive behavior */}
            <style>{`
                @media (min-width: 768px) {
                    .desktop-nav { display: flex !important; }
                    .desktop-auth { display: flex !important; }
                    .mobile-menu-btn { display: none !important; }
                    .mobile-menu { display: none !important; }
                }
            `}</style>
        </motion.header>
    );
};

export default Navbar;
