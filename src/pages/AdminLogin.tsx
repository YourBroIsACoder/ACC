// src/pages/AdminLogin.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../firebase/firebase';

export default function AdminLogin({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleNavigate = (section: string) => {
    const path = `/${section}`;
    window.history.pushState({}, '', path);
    setActiveSection(section);
  };
  
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      handleNavigate('admin');
    } catch (err) {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <section className="h-screen flex justify-center items-center">
      <motion.div className="w-full max-w-md p-8 bg-gray-800/50 rounded-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Admin Sign In</h1>
        <form onSubmit={handleAdminLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 rounded-lg bg-gray-900 text-white" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 rounded-lg bg-gray-900 text-white" />
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-lg font-semibold text-white bg-purple-600">Sign In</button>
        </form>
      </motion.div>
    </section>
  );
}