import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Navbar from './Navbar';
import useWebSocket from '../hooks/useWebSocket';

// Notification Toast Component
const NotificationToast = ({ notification, onClose }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'BID_SUBMITTED':
                return <Bell style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />;
            case 'BID_ACCEPTED':
                return <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a' }} />;
            case 'error':
                return <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} />;
            default:
                return <Info style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-brand-orange)' }} />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'BID_ACCEPTED':
                return 'rgba(134, 239, 172, 0.95)';
            case 'error':
                return 'rgba(254, 202, 202, 0.95)';
            default:
                return 'rgba(255, 255, 255, 0.98)';
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            style={{
                backgroundColor: getBgColor(notification.type),
                borderRadius: '1rem',
                padding: '1rem 1.25rem',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                maxWidth: '24rem',
                backdropFilter: 'blur(10px)'
            }}
        >
            <div style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                {getIcon(notification.type)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                {notification.gigTitle && (
                    <p style={{
                        fontWeight: 600,
                        color: 'var(--color-brand-black)',
                        fontSize: '0.875rem',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {notification.gigTitle}
                    </p>
                )}
                <p style={{
                    color: '#52525b',
                    fontSize: '0.875rem',
                    lineHeight: 1.4
                }}>
                    {notification.message}
                </p>
                <p style={{
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    marginTop: '0.5rem'
                }}>
                    {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
            </div>
            <button
                onClick={onClose}
                style={{
                    flexShrink: 0,
                    padding: '0.25rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <X style={{ width: '1rem', height: '1rem', color: '#9ca3af' }} />
            </button>
        </motion.div>
    );
};

const Layout = () => {
    const { notifications, markAsRead } = useWebSocket();
    const [visibleNotifications, setVisibleNotifications] = useState([]);

    // Show new notifications as toasts
    useEffect(() => {
        const unreadNotifications = notifications.filter(n => !n.read);
        if (unreadNotifications.length > 0) {
            const latestNotification = unreadNotifications[0];
            if (!visibleNotifications.find(n => n.id === latestNotification.id)) {
                setVisibleNotifications(prev => [latestNotification, ...prev].slice(0, 3));
            }
        }
    }, [notifications]);

    const handleCloseToast = (notificationId) => {
        setVisibleNotifications(prev => prev.filter(n => n.id !== notificationId));
        markAsRead(notificationId);
    };

    return (
        <div className="dot-pattern" style={{ minHeight: '100vh' }}>
            <Navbar />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ paddingTop: '6rem' }}
            >
                <Outlet />
            </motion.main>

            {/* Notification Toasts */}
            <div style={{
                position: 'fixed',
                top: '5rem',
                right: '1.5rem',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
            }}>
                <AnimatePresence>
                    {visibleNotifications.map((notification) => (
                        <NotificationToast
                            key={notification.id}
                            notification={notification}
                            onClose={() => handleCloseToast(notification.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <footer style={{ marginTop: '5rem', borderTop: '1px solid #e5e5e5', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        {/* Brand */}
                        <div>
                            <h3 className="font-heading" style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-brand-black)', marginBottom: '1rem' }}>
                                Gig<span style={{ color: 'var(--color-brand-orange)' }}>Flow</span>
                            </h3>
                            <p style={{ color: '#52525b', fontSize: '0.875rem' }}>
                                Find your dream freelance projects and connect with amazing clients worldwide.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 style={{ fontWeight: 600, color: 'var(--color-brand-black)', marginBottom: '1rem' }}>For Freelancers</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem' }}>Find Work</a></li>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem' }}>Browse Categories</a></li>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem' }}>Success Stories</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontWeight: 600, color: 'var(--color-brand-black)', marginBottom: '1rem' }}>For Clients</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem' }}>Post a Job</a></li>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem' }}>Find Talent</a></li>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem' }}>Pricing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontWeight: 600, color: 'var(--color-brand-black)', marginBottom: '1rem' }}>Company</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem' }}>About Us</a></li>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem' }}>Blog</a></li>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#52525b', textDecoration: 'none', fontSize: '0.875rem' }}>Support</a></li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e5e5', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: '#71717a' }}>
                            © 2026 GigFlow. All rights reserved.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#71717a' }}>
                            <a href="#" style={{ color: '#71717a', textDecoration: 'none' }}>Privacy</a>
                            <a href="#" style={{ color: '#71717a', textDecoration: 'none' }}>Terms</a>
                            <a href="#" style={{ color: '#71717a', textDecoration: 'none' }}>Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
