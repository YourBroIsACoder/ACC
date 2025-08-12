// src/components/PastEventPage.tsx

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { previousEvents } from '../data/eventsData';

// --- PROPS INTERFACE ---
interface PastEventPageProps {
  id: string;
  setActiveSection: (section: string) => void;
}

export default function PastEventPage({ id, setActiveSection }: PastEventPageProps) {
  const event = previousEvents.find(e => e.id.toString() === id);

  const handleNavigate = (section: string) => {
    const path = `/${section}`;
    window.history.pushState({}, '', path);
    setActiveSection(section);
  };

  if (!event) {
    return (
      <div className="bg-gray-700/50 h-screen flex flex-col justify-center items-center text-white">
        <h2 className="text-3xl font-bold mb-4">Event Not Found</h2>
        <button onClick={() => handleNavigate('events')} className="text-blue-400 hover:text-blue-300">
          ← Back to Events
        </button>
      </div>
    );
  }

  // Animation variants for staggering child animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen">
      {/* 1. Immersive Header Image */}
      <div className="relative h-[50vh] w-full">
        <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <button onClick={() => handleNavigate('events')} className="mb-4 text-blue-400 hover:text-blue-300 font-semibold">
              ← Back to All Events
            </button>
            <h1 className="text-4xl md:text-6xl font-bold text-white">{event.title}</h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 2. Event Details Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-center">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <Calendar className="mx-auto mb-2 text-purple-400" />
              <h3 className="font-bold">Date</h3>
              <p className="text-gray-300">{new Date(event.date).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <Clock className="mx-auto mb-2 text-blue-400" />
              <h3 className="font-bold">Time</h3>
              <p className="text-gray-300">{event.time}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <MapPin className="mx-auto mb-2 text-green-400" />
              <h3 className="font-bold">Venue</h3>
              <p className="text-gray-300">{event.venue}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-bold pt-6">{event.type}</h3>
            </div>
          </motion.div>

          {/* 3. Detailed Description */}
          {event.details && (
            <motion.div variants={itemVariants} className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed mb-16">
              <p>{event.details}</p>
            </motion.div>
          )}

          {/* 4. The Photo Gallery */}
          {event.galleryImages && event.galleryImages.length > 0 && (
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-8">Event Gallery</h2>
              {/* This is the masonry grid container */}
              <div className="columns-2 md:columns-3 gap-6 space-y-6">
                {event.galleryImages.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className="overflow-hidden rounded-lg shadow-lg"
                  >
                    <img src={img} alt={`Event gallery image ${index + 1}`} className="w-full h-auto object-cover" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}