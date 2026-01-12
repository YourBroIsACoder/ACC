import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {adminDb, adminAuth } from '../firebase/firebase';
import firebase from 'firebase/compat/app';
import { UserPlus, Megaphone, Calendar, FileText, Trash2, UploadCloud, XCircle, Edit, Save, BookOpenCheck, SquarePen } from 'lucide-react';

// --- INTERFACES ---
interface Event { 
    id: string; 
    title: string; 
    type: 'upcoming' | 'past'; 
    startDate: firebase.firestore.Timestamp | Date; 
    endDate?: firebase.firestore.Timestamp | Date;
    individualDates?: string[]; 
    description?: string;
    coverImageURL?: string; 
    time?: string;
    venue?: string;
    galleryImageURLs?: string[];
}

interface Announcement { // ⬅️ NEW INTERFACE FOR ANNOUNCEMENTS
    id: string;
    title: string;
    content: string;
    date: firebase.firestore.Timestamp;
}

interface NewsletterEntry { id: string; title: string; image: string; pdfURL: string; }
interface ReportEntry { id: string; year: string; url: string; title?: string; summary?: string; }
interface MemberEntry { id: string; isMember: boolean; }

// Helper function to safely convert Firestore Timestamp to string for date input fields
const timestampToDateString = (timestamp: firebase.firestore.Timestamp | Date | undefined): string => {
    if (!timestamp) return '';
    const date = timestamp instanceof firebase.firestore.Timestamp ? timestamp.toDate() : (timestamp as Date);
    return date.toISOString().split('T')[0];
};

// ---------------------------------------------------------------------
// ⚠️ PROPS INTERFACE FOR THE EXTERNAL EVENT FORM
// ---------------------------------------------------------------------
interface EventFormProps {
    // State Values
    isEditing: boolean;
    formTitle: string;
    eventTitle: string;
    eventDescription: string;
    eventTime: string; // ⬅️ ADDED
    eventVenue: string; // ⬅️ ADDED
    eventType: string;
    eventDateType: string;
    eventStartDate: string;
    eventEndDate: string;
    individualDatesInput: string;
    individualDatesList: string[];
    eventCoverImageURL: string;
    eventGalleryImageURLs: string[];
    // Handlers
    handleSaveEvent: (e: React.FormEvent) => Promise<void>;
    resetEventForm: () => void;
    setEventTitle: (title: string) => void;
    setEventDescription: (desc: string) => void;
    setEventTime: (time: string) => void; // ⬅️ ADDED
    setEventVenue: (venue: string) => void; // ⬅️ ADDED
    setEventType: (type: string) => void;
    setEventDateType: (type: string) => void;
    setEventStartDate: (date: string) => void;
    setEventEndDate: (date: string) => void;
    setIndividualDatesInput: (date: string) => void;
    setIndividualDatesList: (dates: string[]) => void;
    setEventCoverImageURL: (url: string) => void;
    // Cloudinary Helpers
    openCloudinaryWidget: (onSuccess: (url: string) => void) => void;
    addGalleryImageURL: (url: string) => void;
    removeGalleryImageURL: (urlToRemove: string) => void;
}

// ---------------------------------------------------------------------
// ⚠️ EXTERNAL EVENT FORM COMPONENT (Prevents input focus loss)
// ---------------------------------------------------------------------
const EventForm = (props: EventFormProps) => (
    <form onSubmit={props.handleSaveEvent} className="space-y-4">
        <h3 className="font-semibold text-xl text-white flex items-center gap-2">
            {props.isEditing ? <Edit size={20}/> : <Calendar size={20}/>} {props.formTitle}
        </h3>
        
        <input 
            type="text" 
            placeholder="Event Title" 
            value={props.eventTitle} 
            onChange={e => props.setEventTitle(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500" // ⬅️ ADDED placeholder-gray-500
        />
        <input 
            type="text" 
            placeholder="Event Time (e.g., 6:00 PM - 8:00 PM)" 
            value={props.eventTime} 
            onChange={e => props.setEventTime(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500"
        />
        <input 
            type="text" 
            placeholder="Event Venue/Location (e.g., Main Auditorium / Online)" 
            value={props.eventVenue} 
            onChange={e => props.setEventVenue(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500"
        />
        
        <textarea 
            placeholder="Event Description (details for the event page)" 
            value={props.eventDescription} 
            onChange={e => props.setEventDescription(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500 h-24" 
        />

        <select 
            value={props.eventType} 
            onChange={e => props.setEventType(e.target.value)} 
            className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500"
        >
            <option value="upcoming">Upcoming Event</option>
            <option value="past">Past Event</option>
        </select>

        {/* Date Type Selector */}
        <label className="block text-gray-400 pt-2">Date Input Type:</label>
        <select 
            value={props.eventDateType} 
            onChange={e => {
                props.setEventDateType(e.target.value); 
                props.setEventStartDate(''); 
                props.setEventEndDate(''); 
                props.setIndividualDatesList([]);
            }} 
            className="w-full p-3 rounded-lg bg-gray-900 text-white"
        >
            <option value="single">Single Date</option>
            <option value="range">Date Range (Start/End)</option>
            <option value="individual">Multiple Individual Dates</option>
        </select>

        {/* Conditional Date Inputs */}
        {props.eventDateType === 'single' && (<input type="date" value={props.eventStartDate} onChange={e => props.setEventStartDate(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white"/>)}
        {props.eventDateType === 'range' && (
            <div className="flex gap-4">
                <input type="date" placeholder="Start Date" value={props.eventStartDate} onChange={e => props.setEventStartDate(e.target.value)} className="w-1/2 p-3 rounded-lg bg-gray-900 text-white"/>
                <input type="date" placeholder="End Date" value={props.eventEndDate} onChange={e => props.setEventEndDate(e.target.value)} className="w-1/2 p-3 rounded-lg bg-gray-900 text-white"/>
            </div>
        )}
        {props.eventDateType === 'individual' && (
            <div>
                <div className="flex gap-2 mb-2">
                    <input type="date" value={props.individualDatesInput} onChange={e => props.setIndividualDatesInput(e.target.value)} className="flex-grow p-3 rounded-lg bg-gray-900 text-white"/>
                    <button type="button" onClick={() => {
                        if (props.individualDatesInput && !props.individualDatesList.includes(props.individualDatesInput)) {
                            props.setIndividualDatesList([...props.individualDatesList, props.individualDatesInput]);
                            props.setIndividualDatesInput('');
                        }
                    }} className="py-2 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 transition">Add Date</button>
                </div>
                <div className="space-y-1">
                    {props.individualDatesList.sort().map(date => (
                        <span key={date} className="inline-flex items-center px-3 py-1 mr-2 text-sm font-medium bg-gray-700 rounded-full text-white">
                            {date}
                            <button type="button" onClick={() => props.setIndividualDatesList(props.individualDatesList.filter(d => d !== date))} className="ml-1 text-red-400 hover:text-red-300">&times;</button>
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Image Uploads (Cover and Gallery) */}
        <div className="pt-4 border-t border-gray-700">
            <label className="block text-gray-300 text-sm font-bold mb-2">Event Cover Image:</label>
            <button type="button" onClick={() => props.openCloudinaryWidget(props.setEventCoverImageURL)} className="py-2 px-4 bg-blue-600 rounded-lg text-white flex items-center gap-2 hover:bg-blue-700 transition">
                <UploadCloud size={18}/> Upload Cover Image
            </button>
            {props.eventCoverImageURL && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                    <img src={props.eventCoverImageURL} alt="Cover Preview" className="h-10 w-10 object-cover rounded"/>
                    <span className="truncate flex-grow">{props.eventCoverImageURL}</span>
                    <button type="button" onClick={() => props.setEventCoverImageURL('')} className="text-red-500 hover:text-red-400"><XCircle size={16}/></button>
                </div>
            )}
        </div>

        <div className="pt-4 border-t border-gray-700">
            <label className="block text-gray-300 text-sm font-bold mb-2">Event Gallery Images:</label>
            <button type="button" onClick={() => props.openCloudinaryWidget(props.addGalleryImageURL)} className="py-2 px-4 bg-indigo-600 rounded-lg text-white flex items-center gap-2 hover:bg-indigo-700 transition">
                <UploadCloud size={18}/> Upload Gallery Image
            </button>
            {props.eventGalleryImageURLs.length > 0 && (
                <div className="mt-2 space-y-2">
                    {props.eventGalleryImageURLs.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900/50 p-2 rounded-md">
                            <img src={url} alt={`Gallery ${index}`} className="h-8 w-8 object-cover rounded"/>
                            <span className="truncate flex-grow">{url}</span>
                            <button type="button" onClick={() => props.removeGalleryImageURL(url)} className="text-red-500 hover:text-red-400"><XCircle size={16}/></button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-grow py-3 px-6 rounded-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 transition flex items-center justify-center gap-2">
                <Save size={18}/> {props.isEditing ? 'Update Event' : 'Publish Event'}
            </button>
            {props.isEditing && (
                <button type="button" onClick={props.resetEventForm} className="py-3 px-6 rounded-lg font-semibold text-gray-400 bg-gray-700 hover:bg-gray-600 transition flex items-center justify-center gap-2">
                    <XCircle size={18}/> Cancel Edit
                </button>
            )}
        </div>
    </form>
);


// ---------------------------------------------------------------------
// MAIN ADMIN COMPONENT
// ---------------------------------------------------------------------
export default function Admin({ setActiveSection }: { setActiveSection: (section: string) => void }) {
    // --- GENERAL STATE ---
    const [authLoading, setAuthLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('members');
    const [message, setMessage] = useState('');
    
    // --- DATA STATE ---
    const [events, setEvents] = useState<Event[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]); // ⬅️ NEW: State for Announcements
    const [newsletters, setNewsletters] = useState<NewsletterEntry[]>([]); 
    const [reports, setReports] = useState<ReportEntry[]>([]); 
    const [members, setMembers] = useState<MemberEntry[]>([]); 

    // --- MEMBER FORM STATE ---
    const [memberNumber, setMemberNumber] = useState('');

    // --- ANNOUNCEMENT FORM STATE ---
    const [isEditingAnnouncement, setIsEditingAnnouncement] = useState(false); // ⬅️ NEW: State for editing announcement
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null); // ⬅️ NEW: State for current announcement being edited
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');
    
    // --- NEWSLETTER FORM STATE ---
    const [newsletterTitle, setNewsletterTitle] = useState('');
    const [newsletterSummary, setNewsletterSummary] = useState('');
    const [newsletterImageURL, setNewsletterImageURL] = useState('');
    const [newsletterPdfURL, setNewsletterPdfURL] = useState('');

    // --- REPORT FORM STATE ---
    const [reportYear, setReportYear] = useState('');
    const [reportPdfURL, setReportPdfURL] = useState('');

    // --- EVENT FORM STATE (Used for both ADD and EDIT) ---
    const [isEditing, setIsEditing] = useState(false); 
    const [editingEvent, setEditingEvent] = useState<Event | null>(null); 
    const [eventTitle, setEventTitle] = useState('');
    const [eventType, setEventType] = useState('upcoming');
    const [eventDescription, setEventDescription] = useState(''); 
    const [eventCoverImageURL, setEventCoverImageURL] = useState('');
    const [eventGalleryImageURLs, setEventGalleryImageURLs] = useState<string[]>([]);
    const [eventDateType, setEventDateType] = useState('single');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');
    const [eventTime, setEventTime] = useState(''); 
    const [eventVenue, setEventVenue] = useState('');
    const [individualDatesInput, setIndividualDatesInput] = useState('');
    const [individualDatesList, setIndividualDatesList] = useState<string[]>([]);


    // --- HELPERS & INITIALIZATION ---

    const handleNavigate = useCallback((section: string) => {
        const path = `/${section}`;
        window.history.pushState({}, '', path);
        setActiveSection(section);
    }, [setActiveSection]);
    
    // Auth Check
    useEffect(() => {
        const unsubscribe = adminAuth.onAuthStateChanged(async (user) => {
            if (user) {
                const adminDoc = await adminDb.collection('admins').doc(user.uid).get();
                if (adminDoc.exists) setAuthLoading(false);
                else { adminAuth.signOut(); handleNavigate(''); }
            } else {
                handleNavigate('admin-login');
            }
        });
        return () => unsubscribe();
    }, [handleNavigate]);

    // Clears all event-related form states
    const resetEventForm = () => {
        setEventTitle(''); 
        setEventType('upcoming');
        setEventDescription('');
        setEventCoverImageURL(''); 
        setEventGalleryImageURLs([]);
        setEventDateType('single'); 
        setEventTime('');
        setEventVenue('');
        setEventStartDate(''); 
        setEventEndDate(''); 
        setIndividualDatesInput('');
        setIndividualDatesList([]);
        setEditingEvent(null);
        setIsEditing(false);
    }

    // Clears all announcement-related form states ⬅️ NEW
    const resetAnnouncementForm = () => {
        setAnnouncementTitle(''); 
        setAnnouncementContent('');
        setEditingAnnouncement(null);
        setIsEditingAnnouncement(false);
    }
    
    // --- POPULATE FORM FOR EDITING (EVENT) ---
    const startEditEvent = (event: Event) => {
        setEditingEvent(event);
        setIsEditing(true);

        // Populate common fields
        setEventTitle(event.title);
        setEventType(event.type);
        setEventDescription(event.description || '');
        setEventCoverImageURL(event.coverImageURL || '');
        setEventGalleryImageURLs(event.galleryImageURLs || []);
        setEventTime(event.time || ''); // ⬅️ LOAD TIME
        setEventVenue(event.venue || ''); // ⬅️ LOAD VENUE

        // Determine and populate date fields
        if (event.individualDates && event.individualDates.length > 0) {
            setEventDateType('individual');
            setIndividualDatesList(event.individualDates);
            setEventStartDate(timestampToDateString(event.startDate));
            setEventEndDate('');
        } else if (event.endDate) {
            setEventDateType('range');
            setEventStartDate(timestampToDateString(event.startDate));
            setEventEndDate(timestampToDateString(event.endDate));
            setIndividualDatesList([]);
        } else {
            setEventDateType('single');
            setEventStartDate(timestampToDateString(event.startDate));
            setEventEndDate('');
            setIndividualDatesList([]);
        }
    };
    
    // --- POPULATE FORM FOR EDITING (ANNOUNCEMENT) ⬅️ NEW ---
    const startEditAnnouncement = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsEditingAnnouncement(true);
        setAnnouncementTitle(announcement.title);
        setAnnouncementContent(announcement.content);
    };


    // --- DATA FETCHING ---
    useEffect(() => {
        if (authLoading) return;
        
        // 1. Fetch Events
        const unsubscribeEvents = adminDb.collection('events').orderBy('startDate', 'desc').onSnapshot(snapshot => {
            setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
        });
        
        // 2. Fetch Announcements ⬅️ NEW
        const unsubscribeAnnouncements = adminDb.collection('announcements').orderBy('date', 'desc').onSnapshot(snapshot => {
            setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
        });


        // 3. Fetch Newsletters
        const unsubscribeNewsletters = adminDb.collection('newsletters').orderBy('date', 'desc').onSnapshot(snapshot => {
            setNewsletters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsletterEntry)));
        });
        
        // 4. Fetch Reports
        const unsubscribeReports = adminDb.collection('reports').orderBy('year', 'desc').onSnapshot(snapshot => {
            setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReportEntry)));
        });
        
        // 5. Fetch Members
        const unsubscribeMembers = adminDb.collection('members').onSnapshot(snapshot => {
            setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MemberEntry)));
        });


        return () => {
            unsubscribeEvents(); 
            unsubscribeAnnouncements(); // ⬅️ NEW
            unsubscribeNewsletters(); 
            unsubscribeReports();
            unsubscribeMembers();
        };
    }, [authLoading]);

    // --- CLOUDINARY UPLOAD WIDGET ---
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    const openCloudinaryWidget = (onSuccess: (url: string) => void) => {
        const myWidget = (window as any).cloudinary.createUploadWidget({
            cloudName: 'dnklyslcz', // <-- PASTE YOUR CLOUD NAME HERE
            uploadPreset: 'acc-website',
             sources: ['local'],
    resource_type: 'raw',  // <-- PASTE YOUR UPLOAD PRESET
        }, (error: any, result: any) => { 
            if (!error && result && result.event === "success") { 
                onSuccess(result.info.secure_url);
            }
        });
        myWidget.open();
    }
    
    const addGalleryImageURL = (url: string) => {
        setEventGalleryImageURLs(prev => [...prev, url]);
    };

    const removeGalleryImageURL = (urlToRemove: string) => {
        setEventGalleryImageURLs(prev => prev.filter(url => url !== urlToRemove));
    };

    // --- HANDLER FUNCTIONS ---

    // Member Handlers (No change)
    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memberNumber) return setMessage('Member number is required.');
        await adminDb.collection('members').doc(memberNumber).set({ isMember: true });
        setMessage(`Member ${memberNumber} added!`);
        setMemberNumber('');
    };

    const handleDeleteMember = async (id: string) => {
        if (window.confirm(`Delete member ${id}?`)) {
            await adminDb.collection('members').doc(id).delete();
            setMessage(`Member ${id} deleted.`);
        }
    }

    // Announcement Handlers ⬅️ MODIFIED (Now handles ADD and EDIT)
    const handleSaveAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!announcementTitle || !announcementContent) return setMessage('Title and Content are required.');
        
        const announcementData = {
            title: announcementTitle,
            content: announcementContent,
            date: firebase.firestore.FieldValue.serverTimestamp(),
        };

        try {
            if (isEditingAnnouncement && editingAnnouncement?.id) {
                await adminDb.collection('announcements').doc(editingAnnouncement.id).update(announcementData);
                setMessage('Announcement updated!');
            } else {
                await adminDb.collection('announcements').add(announcementData);
                setMessage('Announcement published!');
            }
        } catch (error) {
            console.error("Error saving announcement:", error);
            setMessage("Failed to save announcement. Please try again.");
        }
        
        resetAnnouncementForm();
    };

    const handleDeleteAnnouncement = async (id: string) => { // ⬅️ NEW
        if (window.confirm('Are you sure you want to permanently delete this announcement?')) {
            await adminDb.collection('announcements').doc(id).delete();
            setMessage('Announcement deleted.');
        }
    };


    // Newsletter Handlers (No change)
    const handleAddNewsletter = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterTitle || !newsletterPdfURL) return setMessage('Title and PDF URL are required.');
        await adminDb.collection('newsletters').add({
            title: newsletterTitle, summary: newsletterSummary, image: newsletterImageURL,
            pdfURL: newsletterPdfURL, date: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setMessage('Newsletter published!');
        setNewsletterTitle(''); setNewsletterSummary(''); setNewsletterImageURL(''); setNewsletterPdfURL('');
    };

    const handleDeleteNewsletter = async (id: string) => {
        if (window.confirm('Delete this newsletter entry?')) {
            await adminDb.collection('newsletters').doc(id).delete();
            setMessage('Newsletter deleted.');
        }
    };

    // Report Handlers (No change)
    const handleAddReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportYear || !reportPdfURL) return setMessage('Year and PDF URL are required for a report.');
        await adminDb.collection('reports').add({
            year: reportYear,
            url: reportPdfURL,
            date: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setMessage(`Annual Report for ${reportYear} published!`);
        setReportYear(''); setReportPdfURL('');
    };

    const handleDeleteReport = async (id: string) => {
        if (window.confirm('Delete this annual report?')) {
            await adminDb.collection('reports').doc(id).delete();
            setMessage('Report deleted.');
        }
    };

    // Event Handlers (No functional change, just cleanup)
    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validation
        if (!eventTitle) return setMessage('Event title is required.');
        if (!eventStartDate && (eventDateType === 'single' || eventDateType === 'range')) return setMessage('A start date is required.');
        if (eventDateType === 'range' && !eventEndDate) return setMessage('End date is required for a date range.');
        if (eventDateType === 'individual' && individualDatesList.length === 0) return setMessage('Please add at least one individual date.');
        
        // 2. Prepare Data (Start clean, only add required fields)
        let eventData: any = {
            title: eventTitle,
            type: eventType,
            description: eventDescription,
            coverImageURL: eventCoverImageURL,
            galleryImageURLs: eventGalleryImageURLs,
            time: eventTime,
            venue: eventVenue,
        };

        // 3. Set Date Fields
        if (eventDateType === 'range') {
            eventData.startDate = new Date(eventStartDate);
            eventData.endDate = new Date(eventEndDate);
        } else if (eventDateType === 'individual') {
            eventData.startDate = new Date(individualDatesList.sort()[0]);
            eventData.individualDates = individualDatesList;
        } else { // 'single'
            eventData.startDate = new Date(eventStartDate);
        }

        // 4. Handle Deletion for UNUSED Fields (CRUCIAL FIX)
        if (isEditing && editingEvent) {
            if (eventDateType !== 'range' && (editingEvent.endDate || eventData.endDate)) {
                eventData.endDate = firebase.firestore.FieldValue.delete();
            }
            if (eventDateType !== 'individual' && editingEvent.individualDates) {
                eventData.individualDates = firebase.firestore.FieldValue.delete();
            }
        }
        
        try {
            // 5. Perform Write/Update
            if (isEditing && editingEvent?.id) {
                await adminDb.collection('events').doc(editingEvent.id).update(eventData);
                setMessage(`Event "${eventTitle}" updated successfully!`);
            } else {
                await adminDb.collection('events').add(eventData);
                setMessage(`New event "${eventTitle}" added successfully!`);
            }
        } catch (error) {
            console.error("Error saving event:", error);
            setMessage("Failed to save event. Check permissions or network connection.");
        }

        // 6. Cleanup
        resetEventForm();
    };

    const handleDeleteEvent = async (id: string) => {
        if (window.confirm('Are you sure you want to permanently delete this event?')) {
            await adminDb.collection('events').doc(id).delete();
            setMessage('Event deleted.');
        }
    };

    // --- RENDER LOGIC ---

    if (authLoading) {
        return <div className="h-screen flex justify-center items-center text-white">Verifying credentials...</div>;
    }
    
    // Determine the current form title
    const eventFormTitle = isEditing ? 'Edit Existing Event' : 'Add New Event';
    const announcementFormTitle = isEditingAnnouncement ? 'Edit Announcement' : 'Publish Announcement';

    // Prepare the props object for the external EventForm component
    const eventFormProps = {
        // State Values
        isEditing,
        formTitle: eventFormTitle,
        eventTitle,
        eventDescription,
        eventTime, // ⬅️ ADDED
        eventVenue, // ⬅️ ADDED
        eventType,
        eventDateType,
        eventStartDate,
        eventEndDate,
        individualDatesInput,
        individualDatesList,
        eventCoverImageURL,
        eventGalleryImageURLs,
        // Handlers
        handleSaveEvent,
        resetEventForm,
        setEventTitle,
        setEventDescription,
        setEventTime, // ⬅️ ADDED
        setEventVenue, // ⬅️ ADDED
        setEventType,
        setEventDateType,
        setEventStartDate,
        setEventEndDate,
        setIndividualDatesInput,
        setIndividualDatesList,
        setEventCoverImageURL,
        setEventGalleryImageURLs,
        // Cloudinary Helpers
        openCloudinaryWidget,
        addGalleryImageURL,
        removeGalleryImageURL,
    };


    return (
        <section className="py-20">
            <div className="container mx-auto px-4 space-y-8 pt-16">
                <h1 className="text-4xl text-center font-bold text-white">Admin Dashboard</h1>
                {message && <p className="text-center text-green-400">{message}</p>}
                {/* --- NEW Header with Logout Button --- */}
<div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
  <button 
    onClick={() => adminAuth.signOut()}
    className="py-2 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
  >
    Logout
  </button>
</div>

                {/* --- TABS FOR NAVIGATION --- */}
                <div className="flex justify-center border-b border-gray-700 overflow-x-auto pb-1">

                    <button onClick={() => setActiveTab('members')} className={`px-4 py-2 ${activeTab === 'members' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Members</button>
                    <button onClick={() => setActiveTab('announcements')} className={`px-4 py-2 ${activeTab === 'announcements' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Announcements</button>
                    <button onClick={() => setActiveTab('newsletters')} className={`px-4 py-2 ${activeTab === 'newsletters' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Newsletters</button>
                    <button onClick={() => setActiveTab('events')} className={`px-4 py-2 ${activeTab === 'events' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Events</button>
                    <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Reports</button>
                </div>


                {/* --- RENDER CONTENT BASED ON ACTIVE TAB --- */}

                {/* MEMBER TAB */}
                {activeTab === 'members' && (
                    <motion.div className="bg-gray-800/50 p-8 rounded-xl max-w-4xl mx-auto space-y-8">
                        <div className="bg-gray-900/50 p-6 rounded-xl">
                            <h2 className="text-2xl font-bold text-white mb-6"><UserPlus className="inline mr-3"/>Add New Member</h2>
                            <form onSubmit={handleAddMember}>
                                <input type="text" placeholder="12-Digit Member Number" value={memberNumber} onChange={e => setMemberNumber(e.target.value)} maxLength={12} className="w-full p-3 mb-4 rounded-lg bg-gray-900 text-white placeholder-gray-500" /> {/* ⬅️ TEXT WHITE */}
                                <button type="submit" className="py-3 px-6 rounded-lg font-semibold text-white bg-blue-600">Add Member</button>
                            </form>
                        </div>
                        <div className="border-t border-gray-700 pt-6">
                            <h3 className="text-xl font-bold text-white mb-4">Existing Members</h3>
                            <ul className="space-y-2">{members.map(member => (
                                <li key={member.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                                    <span className="text-gray-300">Member ID: {member.id}</span>
                                    <button onClick={() => handleDeleteMember(member.id)} className="p-2 text-red-500 hover:text-red-400 rounded-full bg-gray-700/50"><Trash2 size={16} /></button>
                                </li>))}
                            </ul>
                        </div>
                    </motion.div>
                )}

                {/* ANNOUNCEMENT TAB ⬅️ MODIFIED */}
                {activeTab === 'announcements' && (
                    <motion.div className="bg-gray-800/50 p-8 rounded-xl max-w-4xl mx-auto space-y-8">
                        {/* 1. Announcement ADD/EDIT Form */}
                        <div className="bg-gray-900/50 p-6 rounded-xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Megaphone/> {announcementFormTitle}
                            </h2>
                            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Title" 
                                    value={announcementTitle} 
                                    onChange={e => setAnnouncementTitle(e.target.value)} 
                                    className="w-full p-3 text-white rounded-lg bg-gray-900 placeholder-gray-500" // ⬅️ TEXT WHITE
                                />
                                <textarea 
                                    placeholder="Content" 
                                    value={announcementContent} 
                                    onChange={e => setAnnouncementContent(e.target.value)} 
                                    className="w-full p-3 text-white rounded-lg bg-gray-900 h-24 placeholder-gray-500" // ⬅️ TEXT WHITE
                                ></textarea>
                                
                                <div className="flex gap-4">
                                    <button 
                                        type="submit" 
                                        className="flex-grow py-3 px-6 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                    >
                                        <Save size={18}/> {isEditingAnnouncement ? 'Update Announcement' : 'Publish Announcement'}
                                    </button>
                                    {isEditingAnnouncement && (
                                        <button 
                                            type="button" 
                                            onClick={resetAnnouncementForm} 
                                            className="py-3 px-6 rounded-lg font-semibold text-gray-400 bg-gray-700 hover:bg-gray-600 transition flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={18}/> Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* 2. Existing Announcement List ⬅️ NEW */}
                        <div className="border-t border-gray-700 pt-6">
                            <h3 className="text-xl font-bold text-white mb-4">Currently Published Announcements</h3>
                            <ul className="space-y-3">
                                {announcements.map(announcement => (
                                    <li key={announcement.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-900/50 p-4 rounded-md">
                                        <div className="flex-grow mr-4">
                                            <p className="text-white font-semibold">{announcement.title}</p>
                                            <p className="text-sm text-gray-400 truncate max-w-lg">{announcement.content}</p>
                                        </div>
                                        <div className="flex gap-2 mt-2 sm:mt-0 flex-shrink-0">
                                            <button 
                                                onClick={() => startEditAnnouncement(announcement)} 
                                                className="p-2 text-blue-400 hover:text-blue-300 rounded-full bg-gray-700/50"
                                                title="Edit"
                                            >
                                                <SquarePen size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteAnnouncement(announcement.id)} 
                                                className="p-2 text-red-500 hover:text-red-400 rounded-full bg-gray-700/50"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}

                {/* NEWSLETTER TAB */}
                {activeTab === 'newsletters' && (
                    <motion.div className="bg-gray-800/50 p-8 rounded-xl max-w-4xl mx-auto space-y-8">
                        {/* 1. Newsletter Add Form */}
                        <div className="bg-gray-900/50 p-6 rounded-xl space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><BookOpenCheck size={20}/> Publish New Newsletter</h2>
                            <button onClick={() => openCloudinaryWidget(setNewsletterPdfURL)} className="py-2 px-4 bg-green-600 rounded-lg text-white flex items-center gap-2 hover:bg-green-700 transition"><UploadCloud size={18}/> Upload PDF</button>
                            
                            <form onSubmit={handleAddNewsletter} className="space-y-4">
                                <input type="text" placeholder="Article Title" value={newsletterTitle} onChange={e => setNewsletterTitle(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500"/>
                                <input type="text" placeholder="Full PDF Link (Filled by upload or paste)" value={newsletterPdfURL} onChange={e => setNewsletterPdfURL(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500"/>
                                <input type="text" placeholder="Cover Image URL" value={newsletterImageURL} onChange={e => setNewsletterImageURL(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500"/>
                                <textarea placeholder="Brief Summary" value={newsletterSummary} onChange={e => setNewsletterSummary(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white h-20 placeholder-gray-500"></textarea>
                                <button type="submit" className="py-3 px-6 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 transition">Publish Newsletter</button>
                            </form>
                        </div>

                        {/* 2. Existing Newsletter List */}
                        <div className="border-t border-gray-700 pt-6">
                            <h3 className="text-xl font-bold text-white mb-4">Currently Published</h3>
                            <ul className="space-y-2">{newsletters.map(nl => (
                                <li key={nl.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                                    <span className="text-gray-300">{nl.title}</span>
                                    <button onClick={() => handleDeleteNewsletter(nl.id)} className="p-2 text-red-500 hover:text-red-400 rounded-full bg-gray-700/50"><Trash2 size={16} /></button>
                                </li>))}
                            </ul>
                        </div>
                    </motion.div>
                )}

                {/* EVENTS TAB */}
                {activeTab === 'events' && (
                    <motion.div className="bg-gray-800/50 p-8 rounded-xl max-w-4xl mx-auto space-y-8">
                        
                        {/* 1. Event ADD/EDIT Form */}
                        <div className="bg-gray-900/50 p-6 rounded-xl">
                            <EventForm {...eventFormProps} />
                        </div>
                        
                        {/* 2. Existing Event List */}
                        <div className="border-t border-gray-700 pt-6">
                            <h3 className="text-2xl font-bold text-white mb-4">Current Events</h3>
                            <ul className="space-y-2">{events.map(event => (
                                <li key={event.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                                    <span className="text-gray-300">{event.title} ({event.type})</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEditEvent(event)} className="p-2 text-blue-500 hover:text-blue-400 rounded-full bg-gray-700/50"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-red-500 hover:text-red-400 rounded-full bg-gray-700/50"><Trash2 size={16} /></button>
                                    </div>
                                </li>))}
                            </ul>
                        </div>
                    </motion.div>
                )}
                
                {/* REPORTS TAB */}
                {activeTab === 'reports' && (
                    <motion.div className="bg-gray-800/50 p-8 rounded-xl max-w-4xl mx-auto space-y-8">
                        {/* 1. Report Add Form */}
                        <div className="bg-gray-900/50 p-6 rounded-xl space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileText size={20}/> Publish New Annual Report</h2>
                            <button onClick={() => openCloudinaryWidget(setReportPdfURL)} className="py-2 px-4 bg-green-600 rounded-lg text-white flex items-center gap-2 hover:bg-green-700 transition"><UploadCloud size={18}/> Upload PDF</button>

                            <form onSubmit={handleAddReport} className="space-y-4 mb-8">
                                <input type="number" placeholder="Year (e.g., 2023)" value={reportYear} onChange={e => setReportYear(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500" maxLength={4} min="2000" max={new Date().getFullYear() + 1}/>
                                <input type="text" placeholder="Full PDF Link (Filled by upload or paste)" value={reportPdfURL} onChange={e => setReportPdfURL(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white placeholder-gray-500"/>
                                <button type="submit" className="py-3 px-6 rounded-lg font-semibold text-white bg-yellow-600 hover:bg-yellow-700 transition">Publish Report</button>
                            </form>
                        </div>

                        {/* 2. Existing Report List */}
                        <div className="border-t border-gray-700 pt-6">
                            <h3 className="text-xl font-bold text-white mb-4">Published Reports</h3>
                            <ul className="space-y-2">{reports.map(report => (
                                <li key={report.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                                    <span className="text-gray-300">Annual Report {report.year}</span>
                                    <button onClick={() => handleDeleteReport(report.id)} className="p-2 text-red-500 hover:text-red-400 rounded-full bg-gray-700/50"><Trash2 size={16} /></button>
                                </li>))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}