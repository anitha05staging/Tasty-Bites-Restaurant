import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { Utensils, History, Sparkles, Heart, Award, Users } from 'lucide-react';

const StatCounter = ({ value, label, icon: Icon }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = React.useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = parseInt(value);
            const duration = 2000;
            let timer = setInterval(() => {
                start += Math.ceil(end / 100);
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, duration / 100);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <div ref={ref} className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-8 border border-brand-cream shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Icon size={32} className="text-primary" />
            </div>
            <h3 className="text-4xl font-bold text-secondary mb-2">
                {count}{value.includes('+') ? '+' : ''}
            </h3>
            <p className="text-brand-text-light font-medium uppercase tracking-widest text-xs">{label}</p>
        </div>
    );
};

const TimelineItem = ({ year, title, description, side, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });

    return (
        <div ref={ref} className={`flex flex-col md:flex-row items-center mb-12 last:mb-0 ${side === 'right' ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1 w-full md:w-1/2" />
            <div className="relative flex items-center justify-center px-4">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-10 h-10 bg-primary rounded-full z-10 border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs"
                >
                    {index + 1}
                </motion.div>
                <div className="absolute h-full w-0.5 bg-brand-cream top-10" />
            </div>
            <motion.div 
                initial={{ opacity: 0, x: side === 'left' ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex-1 w-full md:w-1/2 bg-white p-8 rounded-[2rem] shadow-lg border border-brand-cream/50 m-4 text-${side === 'left' ? 'left' : 'right'}`}
            >
                <span className="text-primary font-bold text-lg mb-2 block font-playfair italic">{year}</span>
                <h4 className="text-xl font-playfair font-bold text-secondary mb-3">{title}</h4>
                <p className="text-brand-text-light leading-relaxed">{description}</p>
            </motion.div>
        </div>
    );
};

const About = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const stats = [
        { value: '30+', label: 'Years of Heritage', icon: History },
        { value: '50+', label: 'Authentic Recipes', icon: Utensils },
        { value: '10k+', label: 'Happy Guests', icon: Users },
        { value: '12', label: 'Secret Spices', icon: Sparkles }
    ];

    const milestones = [
        { year: '1992', title: 'The First Kitchen', description: 'Our journey began in a small, bustling kitchen where family recipes were passed down with love.', side: 'left' },
        { year: '2005', title: 'Spreading the Aroma', description: 'We opened our flagship restaurant, dedicated to bringing authentic South Indian flavors to a wider audience.', side: 'right' },
        { year: '2015', title: 'Culinary Excellence', description: 'Recognized for our commitment to tradition and quality, we became a local landmark for food enthusiasts.', side: 'left' },
        { year: 'Today', title: 'Tasty Bites Modern', description: 'Bringing the same timeless traditions into a modern digital era, making soulful food accessible to all.', side: 'right' }
    ];

    const galleryImages = [
        { src: "/images/authentic.jpg", label: "Traditional Craft" },
        { src: "/images/authentic-image.jpg", label: "Soulful Spaces" },
        { src: "/images/bagara-rice.jpg", label: "Generational Recipes" }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-brand-cream/30">
            {/* Hero Section with Parallax */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <motion.div 
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0 z-0"
                >
                    <img 
                        src="/images/hero-bg.png" 
                        alt="Our Story" 
                        className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply" />
                </motion.div>

                <div className="container mx-auto relative z-10 px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="text-accent font-bold tracking-[0.4em] uppercase text-sm block mb-6 px-4 py-2 border border-accent/30 rounded-full w-fit mx-auto backdrop-blur-sm">
                            Our Culinary Legacy
                        </span>
                        <h1 className="text-white font-playfair text-5xl md:text-7xl font-bold mb-8 leading-tight">
                            A Tale of <span className="text-accent italic">Soul</span> & Spice
                        </h1>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex flex-col items-center mt-12"
                        >
                            <span className="text-white/60 text-sm uppercase tracking-widest mb-4">Scroll to discover</span>
                            <div className="w-px h-24 bg-gradient-to-b from-accent to-transparent" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Philosophy - Text Section */}
            <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="mb-16"
                        >
                            <h2 className="text-secondary font-playfair text-4xl md:text-6xl leading-tight font-bold mb-10">
                                "Flavours that whisper <span className="text-primary italic">tradition</span>, <br />
                                crafted for the <span className="text-primary">modern palate</span>."
                            </h2>
                            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left text-brand-text-light text-lg">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="relative p-10 bg-brand-cream/20 rounded-[3rem] border border-brand-cream"
                            >
                                <Heart className="text-primary mb-6" size={40} />
                                <p className="leading-relaxed font-medium">
                                    For generations, our families have perfected the art of South Indian cooking in the heart of traditional kitchens. Every dosa is born from a legacy, every spice blend is a secret whispered through time. We don't just cook; we preserve a way of life that celebrates the joy of slow, soulful food.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="relative p-10 bg-brand-cream/20 rounded-[3rem] border border-brand-cream mt-8 md:mt-12"
                            >
                                <Award className="text-primary mb-6" size={40} />
                                <p className="leading-relaxed font-medium">
                                    From the coastal serenity of Kerala to the vibrant spirit of Bangalore, we've curated a menu that captures the true soul of the South. We invite you to sit at our table, not just as a guest, but as a part of our continuing story. Experience heritage on a plate.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-brand-cream/50 relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <StatCounter key={i} {...stat} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey Timeline */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs">The Voyage</span>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-secondary mt-2">Our Culinary Journey</h2>
                    </div>
                    
                    <div className="max-w-4xl mx-auto relative px-4">
                        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-brand-cream -translate-x-1/2 hidden md:block" />
                        {milestones.map((item, i) => (
                            <TimelineItem key={i} {...item} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Gallery Grid */}
            <section className="py-32 bg-brand-cream/30">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-5xl font-playfair font-bold text-secondary mb-4">Captured Moments</h2>
                            <p className="text-brand-text-light text-lg">A glimpse into our world where every corner tells a story and every dish is a masterpiece.</p>
                        </div>
                        <div className="hidden md:block h-px flex-1 bg-brand-cream mx-12 mb-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {galleryImages.map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl"
                            >
                                <img
                                    src={img.src}
                                    alt={img.label}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                                    <motion.span 
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        className="text-accent font-bold tracking-tighter text-sm uppercase mb-2"
                                    >
                                        The Essence
                                    </motion.span>
                                    <p className="text-white font-playfair text-3xl font-bold italic">{img.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-24 bg-secondary text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img src="/images/hero-bg.png" alt="Pattern" className="w-full h-full object-cover" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-playfair font-bold mb-10 leading-tight">
                        Experience the Magic <br />
                        of <span className="text-accent italic">Tasty Bites</span> Today
                    </h2>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                    >
                        <a href="/menu" className="px-12 py-5 bg-primary text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all inline-flex items-center group">
                            Explore the Menu
                            <Sparkles size={18} className="ml-3 group-hover:rotate-12 transition-transform" />
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
