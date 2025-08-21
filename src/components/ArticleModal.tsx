// src/components/ArticleModal.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Import the SHARED type from your types file
import { NewsletterItem } from '../types'; // Adjust path if needed (e.g., ../types/index.ts)

interface ArticleModalProps {
  article: NewsletterItem | null;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  return (
    <AnimatePresence>
      {article && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700 flex-shrink-0">
              <h2 className="text-2xl font-bold text-white">{article.title}</h2>
              <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700">
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-8 overflow-y-auto">
              {/* Guaranteed Copy Protection */}
              <div 
                className="prose prose-invert prose-lg max-w-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }} 
                onContextMenu={(e) => e.preventDefault()}
              >
                <img src={article.image} alt={article.title} className="w-full aspect-video object-cover rounded-lg mb-6" />

                {/* Check if fullText exists before rendering */}
                {article.fullText && (
                  <p className="text-gray-300 leading-relaxed">{article.fullText}</p>
                )}

                {article.galleryImages && article.galleryImages.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-white mt-8 mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {article.galleryImages.map((img, index) => (
                        <img key={index} src={img} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}