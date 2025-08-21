import firebase from 'firebase/compat/app'; // You'll need to add this import at the top of the file
export interface TeamMember {
  id: number;
  name: string;
  designation: string;
  image: string;
  expertise: string[];
}

export interface Event {
  id: number;
  title: string;
  date: string;
  venue: string;
  description: string;
  image: string;
  time: string;
  type: 'workshop' | 'conference' | 'hackathon' | 'meetup';
}



// ... your other interfaces (TeamMember, Event, etc.)

export interface NewsletterItem {
  id: string; // Changed from number to string
  title: string;
  summary: string;
  image: string;
  date: firebase.firestore.Timestamp; // Changed from string to Firestore Timestamp
  source: string;
  pdfURL: string; // Optional field for PDF URL
  // --- Add the fields needed for the modal ---
  fullText?: string;
  galleryImages?: string[];
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}