import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  image: string;
}

export default function Team() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    import(`../data/team_${selectedYear}.json`)
      .then((data) => setTeamMembers(data.default))
      .catch((err) => console.error('Failed to load team:', err));
  }, [selectedYear]);

  return (
    <section className="py-20 bg-gray-700/50">
      <div className="container mx-auto px-4">

        {/* Year Toggle */}
        <div className="flex justify-center mb-10 space-x-4">
          {['2025', '2024'].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedYear === year
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Committee {year}-{parseInt(year) + 1}
            </button>
          ))}
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Team
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our collective passion for cybersecurity and technology is what drives us forward. Meet the brilliant minds behind our success.
          </p>
        </motion.div>

        {/* Team Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-700/50 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden shadow-lg p-6 flex flex-col items-center text-center"
            >
              <div className="relative w-40 h-40 mb-6 group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-600 group-hover:border-blue-500 transition-colors duration-300 relative z-10">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0 mb-4">
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-blue-400 font-medium text-sm leading-relaxed">
                  {member.designation}
                </p>
              </div>

              <div className="flex space-x-2 w-full mt-auto">
                <a href="#" aria-label={`Email ${member.name}`} className="flex-1 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors group/btn">
                  <Mail className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
                </a>
                <a href="#" aria-label={`LinkedIn for ${member.name}`} className="flex-1 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors group/btn">
                  <Linkedin className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
                </a>
                <a href="#" aria-label={`Github for ${member.name}`} className="flex-1 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors group/btn">
                  <Github className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
