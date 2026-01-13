import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Sparkles,
    Users,
    Shield,
    Zap,
    Star,
    Code,
    Palette,
    PenTool,
    Video,
    BarChart3,
    MessageSquare
} from 'lucide-react';

const LandingPage = () => {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const categories = [
        { name: 'Development', icon: Code, color: 'bg-blue-100 text-blue-600' },
        { name: 'Design', icon: Palette, color: 'bg-pink-100 text-pink-600' },
        { name: 'Writing', icon: PenTool, color: 'bg-green-100 text-green-600' },
        { name: 'Video', icon: Video, color: 'bg-purple-100 text-purple-600' },
        { name: 'Marketing', icon: BarChart3, color: 'bg-orange-100 text-orange-600' },
        { name: 'Consulting', icon: MessageSquare, color: 'bg-teal-100 text-teal-600' },
    ];

    const features = [
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Find the perfect gig in minutes, not days. Our smart matching connects you instantly.'
        },
        {
            icon: Shield,
            title: 'Secure Payments',
            description: 'Your earnings are protected with escrow payments and milestone-based releases.'
        },
        {
            icon: Users,
            title: 'Global Talent',
            description: 'Connect with clients and freelancers from around the world, 24/7.'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'UI/UX Designer',
            avatar: '🎨',
            content: 'GigFlow transformed how I find clients. The platform is intuitive and the projects are top-notch!'
        },
        {
            name: 'Marcus Johnson',
            role: 'Full Stack Developer',
            avatar: '💻',
            content: 'Best freelance platform I\'ve used. Great clients, fair payments, and amazing support.'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Content Writer',
            avatar: '✍️',
            content: 'I doubled my income in 3 months. The quality of projects here is unmatched.'
        }
    ];

    return (
        <div style={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%' }}>
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        style={{ textAlign: 'center' }}
                    >
                        {/* Badge */}
                        <motion.div
                            variants={fadeInUp}
                            className="badge-periwinkle"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
                        >
                            <Sparkles style={{ width: '1rem', height: '1rem' }} />
                            The #1 Freelance Marketplace
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            variants={fadeInUp}
                            className="font-heading"
                            style={{
                                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                                fontWeight: 700,
                                color: 'var(--color-brand-black)',
                                lineHeight: 1.1,
                                marginBottom: '1.5rem'
                            }}
                        >
                            Find your{' '}
                            <span style={{ position: 'relative', display: 'inline-block' }}>
                                <span style={{ position: 'relative', zIndex: 10 }}>next big project</span>
                                <motion.span
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '0.5rem',
                                        left: 0,
                                        height: '1rem',
                                        backgroundColor: 'rgba(255, 107, 74, 0.3)',
                                        zIndex: 0
                                    }}
                                />
                            </span>
                            <br />
                            <span className="font-accent" style={{ fontStyle: 'italic', color: 'var(--color-brand-orange)' }}>today</span>
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            variants={fadeInUp}
                            style={{
                                fontSize: '1.25rem',
                                color: '#52525b',
                                maxWidth: '42rem',
                                margin: '0 auto 2.5rem'
                            }}
                        >
                            Connect with top freelancers and clients worldwide.
                            Build your career, grow your business, all in one place.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={fadeInUp}
                            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                        >
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary"
                                    style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}
                                >
                                    Get Started Free
                                    <ArrowRight style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.5rem' }} />
                                </motion.button>
                            </Link>
                            <Link to="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-secondary"
                                    style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}
                                >
                                    Browse Gigs
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            variants={fadeInUp}
                            style={{ marginTop: '4rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '2rem', color: '#71717a' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ display: 'flex' }}>
                                    {['🧑‍💻', '👩‍🎨', '👨‍💼', '👩‍💻'].map((emoji, i) => (
                                        <span key={i} style={{
                                            width: '2rem',
                                            height: '2rem',
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            border: '2px solid white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1rem',
                                            marginLeft: i > 0 ? '-0.5rem' : 0,
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                        }}>
                                            {emoji}
                                        </span>
                                    ))}
                                </div>
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>50K+ Freelancers</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} style={{ width: '1rem', height: '1rem', fill: '#facc15', color: '#facc15' }} />
                                ))}
                                <span style={{ fontSize: '0.875rem', fontWeight: 500, marginLeft: '0.5rem' }}>4.9/5 Rating</span>
                            </div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                💰 $10M+ Paid to Freelancers
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <section style={{ padding: '5rem 1.5rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center', marginBottom: '3rem' }}
                    >
                        <h2 className="font-heading" style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--color-brand-black)', marginBottom: '1rem' }}>
                            Explore <span className="font-accent" style={{ fontStyle: 'italic', color: 'var(--color-brand-orange)' }}>popular</span> categories
                        </h2>
                        <p style={{ color: '#52525b', maxWidth: '36rem', margin: '0 auto' }}>
                            Find work in hundreds of categories, from development to design and everything in between.
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="card"
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                            >
                                <div className={category.color} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <category.icon style={{ width: '1.5rem', height: '1.5rem' }} />
                                </div>
                                <span style={{ fontWeight: 500, color: 'var(--color-brand-black)' }}>{category.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '5rem 1.5rem', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '4rem' }}
                    >
                        <h2 className="font-heading" style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--color-brand-black)', marginBottom: '1rem' }}>
                            Why freelancers <span className="font-accent" style={{ fontStyle: 'italic', color: 'var(--color-brand-orange)' }}>love</span> us
                        </h2>
                        <p style={{ color: '#52525b', maxWidth: '36rem', margin: '0 auto' }}>
                            We've built the tools and features that make freelancing easier than ever.
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card"
                                style={{ textAlign: 'center' }}
                            >
                                <div style={{ width: '4rem', height: '4rem', backgroundColor: 'rgba(255, 107, 74, 0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <feature.icon style={{ width: '2rem', height: '2rem', color: 'var(--color-brand-orange)' }} />
                                </div>
                                <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-black)', marginBottom: '0.75rem' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: '#52525b' }}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section style={{ padding: '5rem 1.5rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '4rem' }}
                    >
                        <h2 className="font-heading" style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 700, color: 'var(--color-brand-black)', marginBottom: '1rem' }}>
                            Loved by <span className="font-accent" style={{ fontStyle: 'italic', color: 'var(--color-brand-orange)' }}>thousands</span>
                        </h2>
                        <p style={{ color: '#52525b', maxWidth: '36rem', margin: '0 auto' }}>
                            See what our community of freelancers and clients have to say.
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '1.875rem' }}>{testimonial.avatar}</span>
                                    <div>
                                        <h4 style={{ fontWeight: 600, color: 'var(--color-brand-black)' }}>{testimonial.name}</h4>
                                        <p style={{ fontSize: '0.875rem', color: '#71717a' }}>{testimonial.role}</p>
                                    </div>
                                </div>
                                <p style={{ color: '#52525b', fontStyle: 'italic' }}>"{testimonial.content}"</p>
                                <div style={{ display: 'flex', marginTop: '1rem' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} style={{ width: '1rem', height: '1rem', fill: '#facc15', color: '#facc15' }} />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '5rem 1.5rem' }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{
                            backgroundColor: 'var(--color-brand-black)',
                            borderRadius: '1.5rem',
                            padding: '3rem',
                            textAlign: 'center',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Background decoration */}
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '16rem', height: '16rem', backgroundColor: 'rgba(255, 107, 74, 0.2)', borderRadius: '50%', filter: 'blur(3rem)' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '12rem', height: '12rem', backgroundColor: 'rgba(165, 180, 252, 0.2)', borderRadius: '50%', filter: 'blur(3rem)' }} />

                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <h2 className="font-heading" style={{ fontSize: 'clamp(1.875rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1.5rem' }}>
                                Ready to start your{' '}
                                <span className="font-accent" style={{ fontStyle: 'italic', color: 'var(--color-brand-orange)' }}>journey</span>?
                            </h2>
                            <p style={{ color: '#d4d4d8', fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '36rem', margin: '0 auto 2rem' }}>
                                Join thousands of freelancers and clients already using GigFlow. It's free to get started!
                            </p>
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary"
                                    style={{ fontSize: '1.125rem', padding: '1.25rem 2.5rem' }}
                                >
                                    Create Free Account
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
