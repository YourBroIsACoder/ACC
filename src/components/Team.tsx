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
}

// Data for the permanent convenors
const convenors: TeamMember[] = [
  {
    id: 101,
    name: "Mr. Mritunjay Ojha",
    designation: "Convenor",
    image: "/images/Mritunjay_Sir.jpg"
  },
  {
    id: 102,
    name: "Mr. Raj Ramchandani",
    designation: "Convenor",
    image: "/images/Raj_Sir.jpg"
  }
];

export default function Team() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [committeeMembers, setCommitteeMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Statically import data for reliability
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

  // --- NEW: Combine convenors and the current committee into one list ---
  const fullTeam = [...convenors, ...committeeMembers];

  return (
    <section className="py-20 bg-gray-700/50">
      <div className="container mx-auto px-4">

        {/* Main Heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12 pt-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet Our <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The brilliant minds and passionate individuals driving our club forward.
          </p>
        </motion.div>

        {/* Year Toggle - Placed prominently at the top */}
        <div className="flex justify-center mb-12 space-x-4">
          {['2025', '2024'].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${selectedYear === year ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Committee {year}-{parseInt(year) + 1}
            </button>
          ))}
        </div>

        {/* --- UNIFIED TEAM GRID --- */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {!isLoading && fullTeam.map((member, index) => (
              <motion.div
                key={`${selectedYear}-${member.id}`} // Unique key for re-animation
                layout // This tells Framer Motion to animate layout changes
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 flex flex-col items-center text-center"
              >
                <div className="relative w-40 h-40 mb-6">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full border-4 border-gray-600" />
                </div>
                <div className="flex-1 min-w-0 mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className={`font-medium text-sm ${member.designation === 'Convenor' ? 'text-purple-400' : 'text-blue-400'}`}>
                    {member.designation}
                  </p>
                </div>
                <div className="flex space-x-2 w-full mt-auto">
                  <a href={member.email ? `mailto:${member.email}` : '#'} className="flex-1 h-10 bg-gray-700 hover:bg-purple-600 rounded-lg flex items-center justify-center"><Mail size={18} /></a>
                  <a href={member.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center"><Linkedin size={18} /></a>
                  <a href={member.github || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 h-10 bg-gray-700 hover:bg-gray-900 rounded-lg flex items-center justify-center"><Github size={18} /></a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}