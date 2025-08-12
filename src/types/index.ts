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

export interface NewsletterItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  source: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}