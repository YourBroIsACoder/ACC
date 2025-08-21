// src/pages/Admin.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, auth } from '../firebase/firebase';
import firebase from 'firebase/compat/app';
import { UserPlus, BookOpen, Trash2 } from 'lucide-react';

interface NewsletterEntry { id: string; title: string; }

export default function Admin({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [memberNumber, setMemberNumber] = useState('');
  
  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [newsletterSummary, setNewsletterSummary] = useState('');
  const [newsletterImageURL, setNewsletterImageURL] = useState('');
  const [newsletterPdfURL, setNewsletterPdfURL] = useState('');
  const [newsletters, setNewsletters] = useState<NewsletterEntry[]>([]);

  const handleNavigate = (section: string) => {
    const path = section === 'home' ? '/' : `/${section}`;
    window.history.pushState({}, '', path);
    setActiveSection(section);
  };

  // --- THE SECURITY CHECK ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("Logged-in User UID:", user.uid);
        const adminDoc = await db.collection('admins').doc(user.uid).get();
        if (adminDoc.exists) {
          setAuthLoading(false); // Success: User is an admin
        } else {
          auth.signOut(); // Not an admin, sign out and kick
          handleNavigate('');
        }
      } else {
        handleNavigate('admin-login'); // No user, go to admin login
      }
    });
    return () => unsubscribe();
  }, [handleNavigate]);

  // Fetch existing newsletters
  useEffect(() => {
    if (!authLoading) { // Only fetch after we know we're an admin
      const unsubscribe = db.collection('newsletters').orderBy('date', 'desc').onSnapshot(snapshot => {
        setNewsletters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsletterEntry)));
      });
      return () => unsubscribe();
    }
  }, [authLoading]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.collection('members').doc(memberNumber).set({ isMember: true });
    setMessage(`Member ${memberNumber} added successfully!`);
    setMemberNumber('');
  };

  const handleAddNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.collection('newsletters').add({
      title: newsletterTitle, summary: newsletterSummary, image: newsletterImageURL,
      pdfURL: newsletterPdfURL, date: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setMessage('Newsletter published!');
    setNewsletterTitle(''); setNewsletterSummary(''); setNewsletterImageURL(''); setNewsletterPdfURL('');
  };

  const handleDeleteNewsletter = async (id: string) => {
    if (window.confirm('Delete this newsletter entry?')) {
      await db.collection('newsletters').doc(id).delete();
    }
  };

  if (authLoading) {
    return <div className="h-screen flex justify-center items-center text-white">Verifying admin credentials...</div>;
  }

  return (
    <section className="py-20 min-h-screen">
      <div className="container mx-auto px-4 space-y-12 pt-16">
        <h1 className="text-4xl text-center font-bold text-white">Admin Dashboard</h1>
        {message && <p className="text-center text-green-400">{message}</p>}
        <motion.div className="bg-gray-800/50 p-8 rounded-xl max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6"><UserPlus className="inline mr-3"/>Add New Member</h2>
          <form onSubmit={handleAddMember}>
            <input type="text" placeholder="12-Digit Member Number" value={memberNumber} onChange={e => setMemberNumber(e.target.value)} maxLength={12} className="w-full p-3 mb-4 rounded-lg bg-gray-900" />
            <button type="submit" className="py-3 px-6 rounded-lg font-semibold text-white bg-blue-600">Add Member</button>
          </form>
        </motion.div>
        <motion.div className="bg-gray-800/50 p-8 rounded-xl max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6"><BookOpen className="inline mr-3"/>Manage Newsletters</h2>
          <form onSubmit={handleAddNewsletter} className="space-y-4 mb-8">
            <h3 className="font-semibold text-lg text-white">Publish New Entry</h3>
            <input type="text" placeholder="Article Title" value={newsletterTitle} onChange={e => setNewsletterTitle(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white"/>
            <input type="text" placeholder="Full PDF Link (from GitHub Raw)" value={newsletterPdfURL} onChange={e => setNewsletterPdfURL(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white"/>
            <input type="text" placeholder="Cover Image URL" value={newsletterImageURL} onChange={e => setNewsletterImageURL(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white"/>
            <textarea placeholder="Brief Summary" value={newsletterSummary} onChange={e => setNewsletterSummary(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white"></textarea>
            <button type="submit" className="py-3 px-6 rounded-lg font-semibold text-white bg-purple-600">Publish</button>
          </form>
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">Currently Published</h3>
            <ul className="space-y-2">{newsletters.map(nl => (
              <li key={nl.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                <span className="text-gray-300">{nl.title}</span>
                <button onClick={() => handleDeleteNewsletter(nl.id)} className="p-2 text-red-500 hover:text-red-400"><Trash2 size={16} /></button>
              </li>))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}