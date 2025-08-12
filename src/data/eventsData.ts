// src/data/eventsData.ts

export type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  image: string;
  type: string;
  // NEW fields for the detail page
  details?: string;
  galleryImages?: string[];
  pdfFilename?: string; // The filename of the PUBLIC PDF
};

export const upcomingEvents: Event[] = [
  {
    id: 201,
    title: 'Live Phishing Simulation & Defense',
    date: '2025-10-25',
    time: '2:00 PM - 4:00 PM',
    venue: 'Online via Zoom',
    description: 'Join us for a live demonstration of common phishing attacks and learn the key strategies to identify and defend against them in real-time.',
    image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
    type: 'workshop',
  },
  {
    id: 202,
    title: 'Cyber Security Career Talk',
    date: '2025-11-10',
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
    title: 'Cipher Trail',
    date: '2023-09-14',
    time: '10:00 AM - 5:00 PM',
    venue: 'Cyber Hall A',
    description: 'Hands-on workshop focusing on red team operations and adversary simulations.',
    image: '/images/cipher-trail/cipher_trail.jpeg',
    type: 'workshop',
    // --- EXAMPLE DATA FOR THE DETAIL PAGE ---
    details: 'Our flagship Red Team workshop saw over 80 participants engage in a full-day immersive experience. Attendees learned the fundamentals of penetration testing, from reconnaissance and vulnerability scanning to exploitation and post-exploitation techniques, all within a secure, sandboxed lab environment.',
    galleryImages: [
      '/images/cipher-trail/1.jpeg',
      '/images/cipher-trail/2.jpeg',
      '/images/cipher-trail/3.jpeg',
      '/images/cipher-trail/4.jpeg',
      '/images/cipher-trail/5.jpeg'
    ],
    // --- JUST THE FILENAME ---
    pdfFilename: 'pitch_deck.pdf',
  },
  {
    id: 102,
    title: 'Code-Breakers: Live Hacking Event',
   date: '2023-09-14',
    time: '10:00 AM - 5:00 PM',
    venue: 'Cyber Hall A',
    description: 'Hands-on workshop focusing on red team operations and adversary simulations.',
    image: '/images/code-breakers/code_breaker.JPG',
    type: 'workshop',
    // --- EXAMPLE DATA FOR THE DETAIL PAGE ---
    details: 'Our flagship Red Team workshop saw over 80 participants engage in a full-day immersive experience. Attendees learned the fundamentals of penetration testing, from reconnaissance and vulnerability scanning to exploitation and post-exploitation techniques, all within a secure, sandboxed lab environment.',
    galleryImages: [
      '/images/code-breakers/2.JPG',
      '/images/code-breakers/1.JPG',
      '/images/code-breakers/4.JPG',
      '/images/code-breakers/3.JPG',
    ] },
    
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