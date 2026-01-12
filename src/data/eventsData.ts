// src/data/eventsData.ts
import cipherTrailThumb from '/images/cipher-trail/cipher_trail.jpeg?url';
import cipherTrail1 from '/images/cipher-trail/1.jpeg?url';
import cipherTrail2 from '/images/cipher-trail/2.jpeg?url';
import cipherTrail3 from '/images/cipher-trail/3.jpeg?url';
import cipherTrail4 from '/images/cipher-trail/4.jpeg?url';
import cipherTrail5 from '/images/cipher-trail/5.jpeg?url';

import codeBreakersThumb from '/images/code-breakers/code_breaker.JPG?url';
import codeBreakers1 from '/images/code-breakers/1.JPG?url';
import codeBreakers2 from '/images/code-breakers/2.JPG?url';
import codeBreakers3 from '/images/code-breakers/3.JPG?url';
import codeBreakers4 from '/images/code-breakers/4.JPG?url';

import hfThumb from '/images/hackerforge/day2.jpg?url';
import hf1 from '/images/hackerforge/day1.jpg?url';
import hf2 from '/images/hackerforge/1.jpg?url';
import hf3 from '/images/hackerforge/poster.jpg?url';
import hf4 from '/images/hackerforge/3.jpg?url';

export type Event = {
  id: number;
  title: string;
  // --- UPDATED DATE FIELDS ---
  startDate: string;        // Used for single date or start of range/first individual date
  endDate?: string;         // Optional: Used for date range
  individualDates?: string[]; // Optional: Used for multiple specific dates
  // ---------------------------
  time: string;
  venue: string;
  description: string;
  image: string; // cover image
  type: string;
  // NEW fields for the detail page
  details?: string;
  galleryImages?: string[];
  pdfFilename?: string; 
};

export const upcomingEvents: Event[] = [
  {
    id: 201,
    title: 'Live Phishing Simulation & Defense',
    // Example: Single Date
    startDate: '2025-10-25',
    time: '2:00 PM - 4:00 PM',
    venue: 'Online via Zoom',
    description: 'Join us for a live demonstration of common phishing attacks and learn the key strategies to identify and defend against them in real-time.',
    image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
    type: 'workshop',
  },
  {
    id: 202,
    title: 'Cyber Security Career Talk',
    // Example: Date Range
    startDate: '2025-11-10',
    endDate: '2025-11-12',
    time: '5:00 PM - 6:00 PM',
    venue: 'Main Auditorium',
    description: 'Industry experts from leading tech companies share their journey and insights into building a successful career in cybersecurity.',
    image: 'https://images.pexels.com/photos/3184429/pexels-photo-3184429.jpeg?auto=compress&cs=tinysrgb&w=800',
    type: 'conference',
  },
];

export const previousEvents: Event[] = [
    {
     id: 101,
     title: 'HackerForge',
     // Example: Multiple Individual Dates
     startDate: '2025-09-03', // Primary date for sorting/display
     individualDates: ['2025-09-03', '2025-09-04','2025-09-06'],
     time: '3:00 PM - 4:30 PM',
     venue: 'AX-409',
     description: 'Hands-on workshop focusing on red team operations and adversary simulations.',
     image: hfThumb,
     type: 'workshop',
     details: 'Our flagship Red Team workshop saw over 80 participants engage...',
     galleryImages: [hf1, hf2, hf3, hf4],
     pdfFilename: 'pitch_deck.pdf',
   },
   {
     id: 102,
     title: 'Cipher Trail',
     // Example: Single Date
     startDate: '2025-02-13',
     time: '10:00 AM - 5:00 PM',
     venue: 'AX-506',
     description: 'Hands-on workshop focusing on red team operations and adversary simulations.',
     image: cipherTrailThumb,
     type: 'workshop',
     details: 'Our flagship Red Team workshop saw over 80 participants engage...',
     galleryImages: [cipherTrail1, cipherTrail2, cipherTrail3, cipherTrail4, cipherTrail5],
     pdfFilename: 'pitch_deck.pdf',
   },
   {
     id: 103,
     title: 'Code-Breakers: Live Hacking Event',
     // Example: Single Date
    startDate: '2024-09-05',
     time: '2:30 PM - 4:30 PM',
     venue: 'Cyber Hall A',
     description: 'Hands-on workshop focusing on red team operations and adversary simulations.',
     image: codeBreakersThumb,
     type: 'workshop',
     details: 'Our flagship Red Team workshop saw over 80 participants engage...',
     galleryImages: [codeBreakers2, codeBreakers1, codeBreakers4, codeBreakers3],
    },
    
  // ... more past events
];
export const annualReports = [
  {
    year: '2023',
    title: 'Agnel CyberCell Annual Report 2023',
    summary: 'A comprehensive summary of our workshops, competitions, and community initiatives throughout the 2023 academic year.',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    pdfFilename: 'pitch_deck.pdf', // Make sure this PDF is in your /public folder
  },
  {
    year: '2022',
    title: 'Agnel CyberCell Annual Report 2022',
    summary: 'Looking back at a foundational year of growth, keynote speakers, and our first national-level hackathon.',
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
    pdfFilename: 'annual-report-2022.pdf', // Make sure this PDF is in your /public folder
  },
  // Add more past reports here as needed
];
