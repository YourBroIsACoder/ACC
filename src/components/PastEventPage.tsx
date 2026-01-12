import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// ⬇️ Import Firebase and Firestore instance
import { db } from '../firebase/firebase'; 
import firebase from 'firebase/compat/app';
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react'; 

// --- INTERFACES (Must match Firestore structure) ---
interface Event { 
    id: string;
    title: string;
    type: 'upcoming' | 'past'; 
    
    // Date Fields (stored as JS Date objects in state after fetching)
    startDate: firebase.firestore.Timestamp | Date; 
    endDate?: firebase.firestore.Timestamp | Date;
    individualDates?: string[];
    
    // Other Fields
    time?: string;
    venue?: string; 
    description?: string; // Now description is the detailed text
    coverImageURL?: string; 
    galleryImageURLs?: string[];
}

// --- PROPS INTERFACE ---
interface PastEventPageProps {
    // The ID is the Firestore Document ID from the URL path (e.g., PMb0IYB9bLostxjStJ1W)
    id: string; 
    setActiveSection: (section: string) => void;
}

// Helper function (re-used from Events.tsx)
const format = (dateValue: any): string => {
    let date: Date;
    if (dateValue && typeof dateValue.toDate === 'function') {
        date = date = dateValue.toDate();
    } else if (dateValue instanceof Date) {
        date = dateValue;
    } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
    } else {
        return 'N/A';
    }
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
};

// Helper function (re-used from Events.tsx)
const renderDateString = (event: Event) => {
    const calendarIcon = <Calendar className="w-5 h-5 mr-3 text-gray-400" />;
    
    if (event.individualDates && event.individualDates.length > 0) {
        return (
            <div className="flex flex-wrap items-center text-gray-300">
                {calendarIcon}
                {event.individualDates.map((d, idx) => (
                    <span key={idx}>
                        {format(d)}
                        {idx < event.individualDates!.length - 1 && ', '}
                    </span>
                ))}
            </div>
        );
    } else if (event.endDate) {
        return (
            <div className="flex items-center text-gray-300">
                {calendarIcon}
                <span>{format(event.startDate)} - {format(event.endDate)}</span>
            </div>
        );
    } else {
        return (
            <div className="flex items-center text-gray-300">
                {calendarIcon}
                <span>{format(event.startDate)}</span>
            </div>
        );
    }
};


export default function PastEventPage({ id, setActiveSection }: PastEventPageProps) {
    // ⬇️ NEW STATE: To hold fetched data and manage loading
    const [eventData, setEventData] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    const handleBack = () => {
        // Use the original navigation logic but ensure correct section is set
        const path = `/events`;
        window.history.pushState({}, '', path);
        setActiveSection('events');
    };
    
    // ⬇️ NEW EFFECT: Fetch event data from Firestore based on ID
    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        
        const unsubscribe = db.collection('events').doc(id).onSnapshot(doc => {
            if (doc.exists) {
                // Safely cast data and ensure ID is included
                setEventData({ id: doc.id, ...doc.data() } as Event);
            } else {
                setEventData(null); 
            }
            setLoading(false);
        }, error => {
            console.error("Error fetching event:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]); // Re-run fetch when ID changes

    
    // -----------------------------------------------------------
    // CONDITIONAL RENDER START
    // -----------------------------------------------------------
    if (loading) {
        return (
            <div className="bg-gray-800 h-screen flex flex-col justify-center items-center text-white">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
                <h2 className="text-xl">Loading Event Details...</h2>
            </div>
        );
    }

    if (!eventData) {
        return (
            <div className="bg-gray-800 h-screen flex flex-col justify-center items-center text-white p-8">
                <h2 className="text-3xl font-bold mb-4">Event Not Found</h2>
                <p className="text-gray-400 mb-6">The link may be broken or the event was deleted.</p>
                <button onClick={handleBack} className="text-blue-400 hover:text-blue-300 font-semibold">
                    ← Back to Events
                </button>
            </div>
        );
    }

    // Use eventData instead of the old 'event' variable
    const event = eventData; 
    
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
                {/* ⬇️ Use coverImageURL from Firestore */}
                <img src={event.coverImageURL || 'placeholder.jpg'} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <button onClick={handleBack} className="mb-4 text-blue-400 hover:text-blue-300 font-semibold">
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
                         <div className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-center justify-center">
                            <Calendar className="mb-2 text-purple-400" />
                            <h3 className="font-bold">Date</h3>
                            {/* ⬇️ RENDERED DATE STRING IS CENTRED VIA PARENT FLEX */}
                            {renderDateString(event)} 
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <Clock className="mx-auto mb-2 text-blue-400" />
                            <h3 className="font-bold">Time</h3>
                            <p className="text-gray-300">{event.time || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <MapPin className="mx-auto mb-2 text-green-400" />
                            <h3 className="font-bold">Venue</h3>
                            <p className="text-gray-300">{event.venue || 'TBA'}</p>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-center justify-center">
    {/* This requires a small helper in PastEventPage.tsx, but here's the inline result: */}
    <h3 className="font-bold mb-1">Category</h3>
    <p className="text-blue-300 font-semibold text-center capitalize">{event.type}</p>
</div>
                    </motion.div>

                    {/* 3. Detailed Description (using the new description field) */}
                    {event.description && (
                        <motion.div variants={itemVariants} className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed mb-16">
                            {/* ⬇️ Render description, preserving line breaks */}
                            <p style={{ whiteSpace: 'pre-wrap' }}>{event.description}</p>
                        </motion.div>
                    )}

                    {/* 4. The Photo Gallery */}
                    {event.galleryImageURLs && event.galleryImageURLs.length > 0 && (
                        <motion.div variants={itemVariants}>
                            <h2 className="text-3xl font-bold mb-8">Photo Gallery</h2>
                            <div className="columns-2 md:columns-3 gap-6 space-y-6">
                                {event.galleryImageURLs.map((img, index) => (
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
                    <button onClick={handleBack} className="mt-12 inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold text-lg">
                        ← Back to all Events
                    </button>
                </motion.div>
            </div>
        </main>
    );
}