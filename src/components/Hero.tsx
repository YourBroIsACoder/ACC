// src/components/Hero.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- DATA FOR THE CINEMATIC BACKGROUND (WITH VIDEO) ---
const cinematicShowcase = [
  {
    type: 'image',
    path: 'images/code-breakers/code_breaker.JPG',
  },
  {
    type: 'video',
    path: 'videos/clip.mp4', // Your video is back!
  },
  {
    type: 'image',
    path: 'images/code-breakers/1.JPG',
  },
  {
    type: 'image',
    path: 'images/cipher-trail/cipher_trail.jpeg',
  },
];

// --- DATA FOR THE INFORMATIONAL CAROUSEL ---
const featuredEvents = [
  {
    title: 'Code-Breakers: Live Hacking Event',
    description: 'Our members dive deep into penetration testing techniques in a controlled, secure environment.',
    image: 'images/code-breakers/code_breaker.JPG',
  },
  {
    title: 'Cipher-Trail: National CTF Competition',
    description: 'Teams compete to solve complex cybersecurity challenges, testing their skills against the clock and each other.',
    image: 'images/cipher-trail/cipher_trail.jpeg',
  },
  {
    title: 'Workshop: Building Secure IoT Devices',
    description: 'We designed and built a rover with secure communication protocols from the ground up using Raspberry Pi.',
    image: 'https://images.pexels.com/photos/4386341/pexels-photo-4386341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

interface HeroProps {
  setActiveSection: (section: string) => void;
}

export default function Hero({ setActiveSection }: HeroProps) {
  const [currentBgSlide, setCurrentBgSlide] = useState(0);
  const [currentFeaturedSlide, setCurrentFeaturedSlide] = useState(0);

  // --- THIS IS THE BUG FIX ---
  // The logic now correctly calculates the next index without using the 'in' operator.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgSlide((prev) => (prev + 1) % cinematicShowcase.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeaturedSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextFeatured = () => setCurrentFeaturedSlide((p) => (p + 1) % featuredEvents.length);
  const prevFeatured = () => setCurrentFeaturedSlide((p) => (p - 1 + featuredEvents.length) % featuredEvents.length);

  const handleNavigate = (section: string) => {
    const path = `/${section}`;
    window.history.pushState({}, '', path);
    setActiveSection(section);
  };

  return (
    <div>
      {/* PART 1: The Cinematic Full-Screen Hero (Now with Video Support) */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={currentBgSlide}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            {/* Conditional rendering for image vs. video */}
            {cinematicShowcase[currentBgSlide].type === 'video' ? (
              <video
                key={cinematicShowcase[currentBgSlide].path}
                src={cinematicShowcase[currentBgSlide].path}
                autoPlay muted loop playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={cinematicShowcase[currentBgSlide].path}
                alt="Club background"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/60"></div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 p-4">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>
            <div className="flex justify-center items-center gap-2">
              <img src="images/fcritlogo.png" alt="Institute Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-semibold text-white">Fr. C Rodrigues Institute of Technology</span>
            </div>
            <p className="text-base text-gray-300 mb-2">presents</p>
            <img src="images/text1.png" alt="Agnel CyberCell" className="h-48 md:h-64 w-auto mx-auto object-contain block my-4" style={{ filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.5))' }} />
            <p className="text-2xl md:text-3xl text-gray-200 mb-8 max-w-2xl mx-auto font-light" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              We don't just talk about security—we build it, break it, and make it better.
            </p>
            <button onClick={() => handleNavigate('join-us')} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-10 rounded-full text-lg transition-all">
              Join Our Mission
            </button>
          </motion.div>
        </div>
      </section>

      {/* PART 2: The Informational "Featured Events" Carousel */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Our Flagship Events</h2>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-gray-700/50 shadow-2xl shadow-black/30">
              <AnimatePresence>
                <motion.div
                  key={currentFeaturedSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img src={featuredEvents[currentFeaturedSlide].image} alt={featuredEvents[currentFeaturedSlide].title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
                    <h3 className="text-2xl font-bold text-white">{featuredEvents[currentFeaturedSlide].title}</h3>
                    <p className="text-gray-300 text-sm">{featuredEvents[currentFeaturedSlide].description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <button onClick={prevFeatured} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/60"><ChevronLeft size={24} /></button>
              <button onClick={nextFeatured} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/60"><ChevronRight size={24} /></button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {featuredEvents.map((_, index) => (
                  <div key={index} onClick={() => setCurrentFeaturedSlide(index)} className={`h-2 w-2 rounded-full cursor-pointer transition-all ${currentFeaturedSlide === index ? 'w-4 bg-white' : 'bg-white/50'}`} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
