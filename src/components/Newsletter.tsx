// src/components/Newsletter.tsx
'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import firebase from 'firebase/compat/app';
import { NewsletterItem } from '../types';
import PdfViewerModal from './PdfViewerModal'; // Import the corrected type

export default function Newsletter() {
  const [clubNumber, setClubNumber] = useState('');
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [articles, setArticles] = useState<NewsletterItem[]>([]);
    const [pdfToView, setPdfToView] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = db
        .collection('newsletters')
        .orderBy('date', 'desc')
        .onSnapshot((snapshot) => {
          const fetchedArticles = snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as NewsletterItem)
          );
          setArticles(fetchedArticles);
        });
      return () => unsubscribe();
    } else {
      setArticles([]);
    }
  }, [user]);

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
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

   const handleReadPdf = (pdfUrl: string) => {
    if (pdfUrl) {
      setPdfToView(pdfUrl);
    } else {
      alert("PDF link is not available for this article.");
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-800 flex justify-center items-center h-screen">
        <p className="text-xl text-white">
          Checking authentication status...
        </p>
      </section>
    );
  }

  return (
    <div className="relative bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-1"
        style={{
          backgroundImage: `url(/images/cipher-trail/IMG_9449.jpeg)`,
        }}
      ></div>

      <section className="py-20 bg-gray-800/90 min-h-screen relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 pt-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Latest{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                News
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Your exclusive access to our club's insights and analysis.
            </p>
          </motion.div>

          {user ? (
            <>
              <div className="text-right mb-4">
                <button
                  onClick={handleLogout}
                  className="py-2 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
              {articles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                  {articles.map((item) => (
                    <motion.article
                      key={item.id}
                      className="bg-gray-800/90 rounded-xl border border-gray-700 shadow-xl group flex flex-col"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="aspect-video overflow-hidden rounded-t-xl">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center text-gray-400 text-sm mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          {item.date?.toDate().toLocaleDateString()}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3 flex-grow">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 mb-4 line-clamp-3">
                          {item.summary}
                        </p>
                        <button
                          onClick={() => handleReadPdf(item.pdfURL)}
                          className="font-semibold text-blue-400 hover:text-blue-300 mt-auto self-start"
                        >
                          Read Now →
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">
                  No newsletters have been published yet. Check back soon!
                </p>
              )}
            </>
          ) : (
            <motion.div
              className="max-w-xl mx-auto p-8 bg-gray-800/90 rounded-xl shadow-2xl border border-gray-600 relative z-10"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Access the Newsletter
              </h3>
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  value={clubNumber}
                  onChange={(e) => setClubNumber(e.target.value)}
                  placeholder="Enter 12-digit club number"
                  maxLength={12}
                  disabled={isVerifying}
                  className="w-full p-3 mb-4 text-white placeholder-gray-400 rounded-lg bg-gray-900 border border-gray-600"
                />
                {error && <p className="text-red-400 mb-4">{error}</p>}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isVerifying ? 'Verifying...' : 'Proceed'}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </section>
      <PdfViewerModal pdfUrl={pdfToView} onClose={() => setPdfToView(null)} />
    </div>
    
  );
}
