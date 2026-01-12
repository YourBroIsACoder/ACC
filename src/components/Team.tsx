// src/components/Team.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  image: string;
  email?: string;
  linkedin?: string;
  github?: string;
  developer?: boolean;
}

// Data for the permanent convenors
const convenors: TeamMember[] = [
  {
    id: 101,
    name: "Mr. Mritunjay Ojha",
    designation: "Convenor",
    image: "images/Mritunjay_Sir.jpg"
  },
  {
    id: 102,
    name: "Mr. Raj Ramchandani",
    designation: "Convenor",
    image: "images/Raj_Sir.jpg"
  }
];

export default function Team() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [committeeMembers, setCommitteeMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (selectedYear === '2025') {
      import('../data/team_2025.json').then(data => {
        setCommitteeMembers(data.default);
        setIsLoading(false);
      });
    } else if (selectedYear === '2024') {
      import('../data/team_2024.json').then(data => {
        setCommitteeMembers(data.default);
        setIsLoading(false);
      });
    }
  }, [selectedYear]);

  const fullTeam = [...convenors, ...committeeMembers];

  return (
    // Changed background to gray-900 for a better "Dark Theme" contrast
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">

        {/* Main Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="text-center mb-12 pt-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet Our <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The brilliant minds and passionate individuals driving our club forward.
          </p>
        </motion.div>

        {/* Year Toggle */}
        <div className="flex justify-center mb-12 space-x-4">
          {['2025', '2024'].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedYear === year 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Committee {year}-{parseInt(year) + 1}
            </button>
          ))}
        </div>

        {/* --- TEAM GRID --- */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode='wait'>
            {!isLoading && fullTeam.map((member, index) => (
              <motion.div
                key={`${selectedYear}-${member.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} 
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5 }} // Simple float up effect
                
                // --- THE CARD STYLE ---
                className={`
                  rounded-2xl p-6 flex flex-col items-center text-center relative group
                  bg-gray-800/50 backdrop-blur-sm
                  transition-all duration-300
                  
                `}
              >
                {/* Developer Badge */}
                {member.developer && (
                  <div className="absolute top-0 right-0 m-3 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg">
                    Dev
                  </div>
                )}
                
                {/* Image */}
                <div className="relative w-40 h-40 mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className={`w-full h-full object-cover rounded-full border-4 ${member.developer ? 'border-purple-500/30' : 'border-gray-700'}`} 
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 mb-4 w-full">
                  <h3 className="text-xl font-bold text-white mb-1 truncate">{member.name}</h3>
                  <p className={`font-medium text-sm ${member.designation === 'Convenor' ? 'text-purple-400' : 'text-blue-400'}`}>
                    {member.designation}
                  </p>
                </div>

                {/* Social Icons (Restored) */}
                <div className="flex space-x-4 pt-4 border-t border-gray-700 w-full justify-center">
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <Github size={20} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                      <Linkedin size={20} />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-purple-400 transition-colors">
                      <Mail size={20} />
                    </a>
                  )}
                </div>
                
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}