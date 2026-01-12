import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/firebase'; // Assuming db is exported from firebase.ts
import firebase from 'firebase/compat/app';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';

// --- INTERFACES ---
interface Event { 
    id: string; // Document ID
    title: string; 
    type: 'upcoming' | 'past'; 
    // Date Fields (stored as JS Date objects in state for consistency)
    startDate: Date; 
    endDate?: Date;
    individualDates?: string[]; // Stored as strings for simple text dates
    // Other Fields
    time?: string;
    venue?: string; 
    description?: string;
    coverImageURL?: string; 
    galleryImageURLs?: string[];
}

interface Report {
    id: string;
    year: string;
    title?: string;
    summary?: string;
    url: string; // The PDF URL from the Admin panel
}


// Helper function to safely convert any date value (Timestamp, Date object, or string) to a formatted date string.
const format = (dateValue: any): string => {
    let date: Date;
    
    // Check if it's a Firestore Timestamp and convert it
    if (dateValue && typeof dateValue.toDate === 'function') {
        date = dateValue.toDate();
    } 
    // Check if it's already a Date object (which it will be after fetching logic below)
    else if (dateValue instanceof Date) {
        date = dateValue;
    } 
    // Assume it's an ISO date string
    else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
    } else {
        return 'N/A';
    }
    
    // Check for invalid date and return N/A if needed
    if (isNaN(date.getTime())) {
        return 'N/A';
    }
    
    return date.toLocaleDateString();
};


// Helper function for color-coding event types
const getEventTypeColor = (type: string) => {
    switch (type) {
        case 'workshop': return 'bg-blue-600 text-white';
        case 'conference': return 'bg-purple-600 text-white';
        case 'hackathon': return 'bg-green-600 text-white';
        case 'meetup': return 'bg-orange-600 text-white';
        default: return 'bg-gray-600 text-white';
    }
};

// --- HELPER FUNCTION TO RENDER DATES BASED ON DATA STRUCTURE ---
const renderDateString = (event: Event) => {
    const calendarIcon = <Calendar className="w-4 h-4 mr-1" />;
    
    // 1. Multiple Individual Dates
    if (event.individualDates && event.individualDates.length > 0) {
        return (
            <div className="flex items-start text-gray-400 text-sm">
                {calendarIcon}
                <span className="flex flex-wrap gap-x-1">
                    {event.individualDates.map((d, idx) => (
                        <span key={idx} className="whitespace-nowrap">
                            {format(d)}
                            {idx < event.individualDates!.length - 1 && ','}
                        </span>
                    ))}
                </span>
            </div>
        );
    } 
    
    // 2. Date Range
    else if (event.endDate) {
        return (
            <div className="flex items-center text-gray-400 text-sm">
                {calendarIcon}
                <span>{format(event.startDate)} - {format(event.endDate)}</span>
            </div>
        );
    } 
    
    // 3. Single Date (uses startDate)
    else {
        return (
            <div className="flex items-center text-gray-400 text-sm">
                {calendarIcon}
                <span>{format(event.startDate)}</span>
            </div>
        );
    }
};

export default function Events({ setActiveSection }: { setActiveSection: (section: string) => void }) {
    // --- STATE FOR LIVE DATA ---
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [previousEvents, setPreviousEvents] = useState<Event[]>([]);
    const [annualReports, setAnnualReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [currentUpcomingIndex, setCurrentUpcomingIndex] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // --- NAVIGATION LOGIC ---
    const nextUpcoming = () => setCurrentUpcomingIndex((p) => (p + 1) % upcomingEvents.length);
    const prevUpcoming = () => setCurrentUpcomingIndex((p) => (p - 1 + upcomingEvents.length) % upcomingEvents.length);

    const handleNavigate = (section: string) => {
        const path = `/${section}`;
        window.history.pushState({}, '', path);
        setActiveSection(section);
    };

    // ⬅️ NEW HELPER FUNCTION TO OPEN MODAL AND DEBUG
    const handleModalClick = (event: Event) => {
        // console.log("Modal Button Clicked. Event Data:", event); // Optional: Keep for debugging
        if (!event || !event.title) {
            console.error("Cannot show modal: Event data is missing or invalid.");
            return;
        }
        setSelectedEvent(event);
    };

    // --- FIREBASE DATA FETCHING ---
    useEffect(() => {
        const now = new Date();
        
        // Helper to safely convert Firestore Timestamp to JS Date
        const toJsDate = (timestamp: any): Date | undefined => {
             return timestamp && typeof timestamp.toDate === 'function' ? timestamp.toDate() : undefined;
        };

        // 1. Fetch Events
        const unsubscribeEvents = db.collection('events').orderBy('startDate', 'desc').onSnapshot(snapshot => {
            const fetchedEvents: Event[] = snapshot.docs.map(doc => {
                const data = doc.data() as any; // Use 'any' temporarily for raw data structure

                // Convert all Timestamps to native Date objects for local logic
                const startDate = toJsDate(data.startDate) || new Date();
                const endDate = toJsDate(data.endDate);

                return { 
                    id: doc.id, 
                    ...data,
                    startDate: startDate, 
                    endDate: endDate, 
                } as Event;
            });

            // Separate events into upcoming and previous
            setUpcomingEvents(fetchedEvents.filter(e => e.startDate >= now));
            setPreviousEvents(fetchedEvents.filter(e => e.startDate < now));
        });

        // 2. Fetch Reports
        const unsubscribeReports = db.collection('reports').orderBy('year', 'desc').onSnapshot(snapshot => {
            setAnnualReports(snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            } as Report)));
            setLoading(false); // Set loading to false once reports (the last main fetch) is complete
        });

        return () => {
            unsubscribeEvents();
            unsubscribeReports();
        };
    }, []);

    if (loading) {
        return <div className="h-screen flex justify-center items-center text-white text-xl">Loading events and reports...</div>;
    }


    return (
        <section className="py-20 bg-gray-700/50 text-white min-h-screen">
            <div className="container mx-auto px-4">
                
                {/* Upcoming Events Section */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 pt-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Upcoming <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Events</span></h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">Join our exciting events to expand your knowledge and network.</p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    {upcomingEvents.length > 0 ? (
                        <>
                            <AnimatePresence mode="wait">
                                {/* Use optional chaining for safety */}
                                {upcomingEvents[currentUpcomingIndex] && (
                                    <motion.div
                                        key={currentUpcomingIndex}
                                        initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -200 }}
                                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                                        className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden"
                                    >
                                        <div className="md:flex">
                                            <div className="md:w-1/2">
                                                <img 
                                                    src={upcomingEvents[currentUpcomingIndex].coverImageURL || 'placeholder.jpg'} // Use coverImageURL
                                                    alt={upcomingEvents[currentUpcomingIndex].title} 
                                                    className="w-full h-64 md:h-full object-cover" 
                                                />
                                            </div>
                                            <div className="md:w-1/2 p-6 flex flex-col">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(upcomingEvents[currentUpcomingIndex].type)}`}>{upcomingEvents[currentUpcomingIndex].type}</span>
                                                    {renderDateString(upcomingEvents[currentUpcomingIndex])}
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-4 flex-grow">{upcomingEvents[currentUpcomingIndex].title}</h3>
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center text-gray-300"><Clock className="w-4 h-4 mr-2" />{upcomingEvents[currentUpcomingIndex].time || 'N/A'}</div>
                                                    <div className="flex items-center text-gray-300"><MapPin className="w-4 h-4 mr-2" />{upcomingEvents[currentUpcomingIndex].venue || 'Online'}</div>
                                                </div>
                                                <p className="text-gray-400 mb-6 line-clamp-3">{upcomingEvents[currentUpcomingIndex].description || 'No description available.'}</p>
                                                
                                                {/* ⬅️ UPDATED CLICK HANDLER */}
                                                <button onClick={() => handleModalClick(upcomingEvents[currentUpcomingIndex])} className="mt-auto self-start bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg">View Details</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Carousel Controls */}
                            <div className="flex justify-between items-center mt-6">
                                <button onClick={prevUpcoming} className="flex items-center text-gray-400 hover:text-white" disabled={upcomingEvents.length <= 1}><ChevronLeft className="w-5 h-5 mr-1" /> Prev</button>
                                <div className="flex space-x-2">{upcomingEvents.map((_, index) => (<button key={index} onClick={() => setCurrentUpcomingIndex(index)} className={`w-3 h-3 rounded-full ${index === currentUpcomingIndex ? 'bg-blue-500' : 'bg-gray-600'}`} />))}</div>
                                <button onClick={nextUpcoming} className="flex items-center text-gray-400 hover:text-white" disabled={upcomingEvents.length <= 1}>Next <ChevronRight className="w-5 h-5 ml-1" /></button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-400 bg-gray-900/50 rounded-xl border border-gray-700 p-8">
                            <p>No new events scheduled at the moment. Check back soon!</p>
                        </div>
                    )}
                </div>

                {/* Previous Events (Archive) Section */}
                <div className="mt-32">
                    <motion.h3 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-center mb-12">Our Event <span className="text-gray-400">Archive</span></motion.h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {previousEvents.map((event, index) => (
                            <motion.div key={event.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden flex flex-col group">
                                <div className="aspect-video overflow-hidden">
                                    <img 
                                        src={event.coverImageURL || 'placeholder.jpg'} 
                                        alt={event.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    {renderDateString(event)}
                                    <h4 className="text-xl font-bold text-white mb-2 flex-grow">{event.title}</h4>
                                    <p className="text-gray-400 mb-4 line-clamp-3">{event.description || 'No description available.'}</p>
                                    
                                    {/* ⬅️ Archive button navigates to the detail page */}
                                    <button onClick={() => handleNavigate(`event/${event.id}`)} className="mt-auto self-start text-blue-400 hover:text-blue-300 font-semibold text-left">Read More →</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Annual Reports Section */}
                <div className="mt-32">
                    <motion.h3 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-center mb-12">Annual <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Reports</span></motion.h3>
                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                        {annualReports.map((report, index) => (
                            <motion.div key={report.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-gray-900/50 rounded-xl border border-gray-700 flex flex-col md:flex-row overflow-hidden group">
                                <div className="md:w-1/3">
                                    <div className="w-full h-48 md:h-full object-cover bg-gray-800 flex items-center justify-center">
                                        <FileText size={48} className="text-blue-400" />
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col justify-center md:w-2/3">
                                    <span className="font-bold text-blue-400 mb-1">{report.year} Report</span>
                                    <h4 className="text-xl font-bold text-white mb-2">{report.title || `Annual Report ${report.year}`}</h4>
                                    <p className="text-gray-400 mb-4 flex-grow">{report.summary || 'Click below to view the full annual report document.'}</p>
                                    <a href={report.url} target="_blank" rel="noopener noreferrer" className="mt-auto self-start inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded-lg">
                                        <FileText size={18} /> View Report
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Modal for Upcoming Events */}
                <AnimatePresence>
                    {selectedEvent && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-white">{selectedEvent.title}</h3>
                                        <button onClick={() => setSelectedEvent(null)} className="p-2 rounded-full text-gray-400 hover:bg-gray-700"><X size={24} /></button>
                                    </div>
                                    <img src={selectedEvent.coverImageURL || 'placeholder.jpg'} alt={selectedEvent.title} className="w-full h-48 object-cover rounded-lg mb-6" />
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center text-gray-300">
                                            <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                                            {renderDateString(selectedEvent)}
                                        </div>
                                        <div className="flex items-center text-gray-300"><Clock className="w-5 h-5 mr-3 text-gray-400" /><span>{selectedEvent.time || 'N/A'}</span></div>
                                        <div className="flex items-center text-gray-300"><MapPin className="w-5 h-5 mr-3 text-gray-400" /><span>{selectedEvent.venue || 'Online'}</span></div>
                                    </div>
                                    <p className="text-gray-400 mb-6">{selectedEvent.description || 'No detailed description available.'}</p>
                                    
                                    <div className="flex space-x-4">
                                        <a href="#" className="flex-1 text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg">Register Now</a>
                                    </div>
                                    
                                    {/* Gallery Images (Basic Display) */}
                                    {selectedEvent.galleryImageURLs && selectedEvent.galleryImageURLs.length > 0 && (
                                        <div className="mt-8 pt-4 border-t border-gray-700">
                                            <h4 className="text-xl font-bold text-white mb-4">Event Gallery</h4>
                                            <div className="grid grid-cols-3 gap-3">
                                                {selectedEvent.galleryImageURLs.map((url, index) => (
                                                    <img key={index} src={url} alt={`Gallery image ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}