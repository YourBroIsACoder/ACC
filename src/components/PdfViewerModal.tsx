// src/components/PdfViewerModal.tsx

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { X, ChevronLeft, ChevronRight, Loader, ZoomIn, ZoomOut } from 'lucide-react';

// This setup for the worker remains correct.
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

interface PdfViewerModalProps {
  pdfUrl: string | null;
  onClose: () => void;
}

export default function PdfViewerModal({ pdfUrl, onClose }: PdfViewerModalProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pageWidth, setPageWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setScale(1.0);
  }

  function onPageLoadSuccess(page: any) {
    // Get the original page width to calculate proper scaling
    const viewport = page.getViewport({ scale: 1 });
    setPageWidth(viewport.width);
  }

  // Calculate the initial scale to fit the page width
  useEffect(() => {
    if (pageWidth && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 64; // Account for padding
      const initialScale = Math.min(containerWidth / pageWidth, 1.5); // Max 150% initial scale
      setScale(initialScale);
    }
  }, [pageWidth]);

  const goToPrevPage = () => setPageNumber(prev => (prev > 1 ? prev - 1 : prev));
  const goToNextPage = () => setPageNumber(prev => (numPages && prev < numPages ? prev + 1 : prev));

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.4));

  // Reset to fit width
  const fitToWidth = () => {
    if (pageWidth && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 64;
      const fitScale = containerWidth / pageWidth;
      setScale(Math.min(fitScale, 1.5));
    }
  };

  return (
    <AnimatePresence>
      {pdfUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col"
          onClick={onClose}
        >
          {/* Header */}
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="flex-shrink-0 flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white">Document Viewer</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white hover:bg-red-600 hover:text-white bg-gray-700 transition-colors"
              title="Close document"
            >
              <X size={24} />
            </button>
          </motion.div>

          {/* PDF Document Area with proper scrolling */}
          <div 
            ref={containerRef}
            className="flex-grow overflow-auto flex justify-center items-start py-8 bg-gray-800 relative" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Close Button - positioned relative to PDF area */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              title="Close document"
            >
              <X size={18} />
            </button>
            
            <div className="max-w-full max-h-full">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex justify-center items-center h-64 text-white">
                    <Loader className="animate-spin mr-2" size={24} /> 
                    <span>Loading document...</span>
                  </div>
                }
                error={
                  <div className="text-center text-red-400 p-8">
                    <p>Failed to load PDF.</p>
                    <p className="text-sm mt-2 text-gray-400">Please check if the file exists and is accessible.</p>
                  </div>
                }
                className="flex justify-center"
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale}
                  onLoadSuccess={onPageLoadSuccess}
                  className="shadow-2xl border border-gray-600"
                  canvasBackground="white"
                  loading={
                    <div className="flex justify-center items-center h-96 text-white bg-gray-700 rounded">
                      <Loader className="animate-spin mr-2" size={20} />
                      <span>Loading page...</span>
                    </div>
                  }
                />
              </Document>
            </div>
          </div>

          {/* Footer with enhanced controls */}
          {numPages && (
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="flex-shrink-0 flex justify-center items-center gap-6 p-4 border-t border-gray-700 bg-gray-900 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pagination */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={goToPrevPage} 
                  disabled={pageNumber <= 1} 
                  className="p-2 rounded-full disabled:text-gray-600 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={numPages}
                    value={pageNumber}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= numPages) {
                        setPageNumber(page);
                      }
                    }}
                    className="w-16 px-2 py-1 text-center bg-gray-700 text-white border border-gray-600 rounded text-sm"
                  />
                  <span className="text-gray-400 text-sm">/ {numPages}</span>
                </div>

                <button 
                  onClick={goToNextPage} 
                  disabled={pageNumber >= numPages} 
                  className="p-2 rounded-full disabled:text-gray-600 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Separator */}
              <div className="w-px h-6 bg-gray-600"></div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={zoomOut} 
                  disabled={scale <= 0.4} 
                  className="p-2 rounded-full disabled:text-gray-600 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <ZoomOut size={20} />
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm w-12 text-center">
                    {(scale * 100).toFixed(0)}%
                  </span>
                  <button
                    onClick={fitToWidth}
                    className="px-2 py-1 text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 rounded transition-colors"
                  >
                    Fit
                  </button>
                </div>

                <button 
                  onClick={zoomIn} 
                  disabled={scale >= 3.0} 
                  className="p-2 rounded-full disabled:text-gray-600 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <ZoomIn size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}