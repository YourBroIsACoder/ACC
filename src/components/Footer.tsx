// src/components/Footer.tsx

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-700/50 py-8 text-gray-400">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4">&copy; {new Date().getFullYear()} Agnel CyberCell. All Rights Reserved.</p>
        
        <p className="text-sm relative"> {/* ADDED 'relative' here */}
          Designed & Developed by{' '}
          <a
            // 🚨 Ensure this is your valid, full URL (starts with https://)
            href="https://www.linkedin.com/in/akshath-narvekar-0863322a3" 
            target="_blank"
            rel="noopener noreferrer"
            // ADDED 'inline-block' and 'z-10' here
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-block z-10" 
          >
            Akshath Narvekar
          </a>
        </p>
      </div>
    </footer>
  );
}