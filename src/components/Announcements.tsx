// src/components/Announcements.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/firebase';
import { Announcement } from '../types'; // Import the shared type
import { Megaphone } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const unsubscribe = db.collection('announcements')
      .orderBy('date', 'desc')
      .limit(3) // Only show the 3 most recent announcements
      .onSnapshot(snapshot => {
        setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
      });
    
    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Don't render the whole section if there are no announcements
  if (announcements.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Latest Announcements</h2>
        </motion.div>
        <div className="space-y-6 max-w-3xl mx-auto">
          {announcements.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 flex items-start gap-4"
            >
              <div className="flex-shrink-0 mt-1">
                <Megaphone className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.content}</p>
                <p className="text-xs text-gray-500 mt-4">{item.date.toDate().toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}