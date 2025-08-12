'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import firebase from 'firebase/compat/app';

// Import the new modal component
import ArticleModal from './ArticleModal';

// --- ENRICHED DATA ---
// We've added `fullText` and `galleryImages` for the modal view.
const newsItems = [
  {
    id: 1,
    title: 'AI-Powered Malware Detection Breakthrough',
    summary: 'Researchers develop new machine learning algorithm that detects zero-day malware with 99.7% accuracy...',
    fullText: 'In a significant leap for cybersecurity, researchers have unveiled a new machine learning algorithm that can detect zero-day malware with an unprecedented 99.7% accuracy rate. This system, codenamed "Cerberus," analyzes file heuristics and network behavior in real-time to identify malicious patterns without relying on existing signature databases. This proactive approach is set to revolutionize threat detection and has already been integrated by several leading tech firms in its beta phase.',
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
    galleryImages: [
      'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    date: '2024-01-15',
    source: 'CyberSecurity Today',
  },
  {
    id: 2,
    title: 'Quantum Cryptography Advances',
    summary: 'New quantum key distribution protocol promises unbreakable encryption for future communications infrastructure.',
    fullText: 'A joint research team has successfully demonstrated a new quantum key distribution (QKD) protocol over a record-breaking 500km of fiber optic cable. The protocol leverages the principles of quantum entanglement to ensure that any attempt to intercept the cryptographic key would be instantly detectable. This milestone paves the way for truly secure, "unhackable" communication networks for government, finance, and critical infrastructure.',
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    galleryImages: [],
    date: '2024-01-12',
    source: 'Quantum Security Review',
  },
  // Add fullText and galleryImages to other items as needed
];

// Define a matching type for better code intelligence
type Article = typeof newsItems[0];

export default function Newsletter() {
  const [clubNumber, setClubNumber] = useState('');
  // Use the Firebase user object as the source of truth
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  
  // State to manage which article is shown in the modal
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Correctly listens for the REAL Firebase auth state.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Uses a real, temporary Firebase session for security and persistence.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);
    try {
      const doc = await db.collection('members').doc(clubNumber).get();
      if (doc.exists) {
        await auth.signInAnonymously();
      } else {
        setError('Invalid club number. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setIsVerifying(false);
    }
  };

  // This now works correctly because there is a real session to sign out of.
  const handleLogout = () => {
    auth.signOut();
  };
  
  // This function now opens the modal with the selected article.
  const handleReadMore = (article: Article) => {
    setSelectedArticle(article);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-800 flex justify-center items-center h-screen">
        <p className="text-xl text-white">Checking authentication status...</p>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16 pt-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Latest <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">News</span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Stay updated with the latest developments in cybersecurity, emerging threats, and breakthrough technologies.</p>
          </motion.div>

          {user ? (
            <>
              <div className="text-right mb-4">
                <button onClick={handleLogout} className="py-2 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700">Logout</button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                {newsItems.map((item) => (
                  <motion.article key={item.id} className="bg-gray-700/50 rounded-xl border border-gray-700 group">
                    <div className="aspect-video overflow-hidden rounded-t-xl">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-gray-400 text-sm mb-3"><Calendar className="w-4 h-4 mr-2" />{new Date(item.date).toLocaleDateString()}</div>
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400">{item.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-3">{item.summary}</p>
                      <button onClick={() => handleReadMore(item)} className="font-semibold text-blue-400 hover:text-blue-300">Read more →</button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </>
          ) : (
            <motion.div className="flex flex-col items-center justify-center p-8 bg-gray-700/50 rounded-xl border border-gray-700 max-w-xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Access the Newsletter</h3>
              <p className="text-gray-400 text-center mb-6">Please enter your 12-digit club number to view our exclusive articles.</p>
              <form onSubmit={handleLogin} className="w-full">
                <input type="text" value={clubNumber} onChange={(e) => setClubNumber(e.target.value)} placeholder="Enter your 12-digit club number" maxLength={12} disabled={isVerifying} className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-600 text-white" />
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <button type="submit" disabled={isVerifying} className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900">
                  {isVerifying ? 'Verifying...' : 'Proceed'}
                </button>
              </form>
            </motion.div>
          )}
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </section>

      {/* This line renders the modal when an article is selected */}
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </>
  );
}