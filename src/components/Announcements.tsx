import { motion } from 'framer-motion';
import { Bell, AlertCircle, Info, Calendar } from 'lucide-react';
import { Announcement } from '../types';

const announcements: Announcement[] = [
  {
    id: 1,
    title: 'Ethical Hacking Workshop - Registration Open',
    content: 'Join our comprehensive 3-day ethical hacking workshop featuring hands-on penetration testing, vulnerability assessment, and security tools training.',
    date: '2024-01-20',
    priority: 'high'
  },
  {
    id: 2,
    title: 'CyberSec Conference 2024 - Call for Papers',
    content: 'Submit your research papers for our annual cybersecurity conference. Topics include AI security, blockchain, and quantum cryptography.',
    date: '2024-01-18',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'New Security Certification Program',
    content: 'Introducing our new industry-recognized cybersecurity certification program in partnership with leading security organizations.',
    date: '2024-01-15',
    priority: 'medium'
  },
  {
    id: 4,
    title: 'Weekly Security Updates',
    content: 'Don\'t miss our weekly security briefings every Friday at 6 PM. Stay informed about the latest threats and mitigation strategies.',
    date: '2024-01-14',
    priority: 'low'
  }
];

export default function Announcements() {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'medium': return <Info className="w-5 h-5 text-yellow-400" />;
      default: return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/50 bg-red-900/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-900/10';
      default: return 'border-blue-500/50 bg-blue-900/10';
    }
  };

  return (
    <section className="py-20 bg-gray-800/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Latest <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Announcements</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay informed about club activities, upcoming events, and important updates from the cybersecurity community.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`p-6 rounded-xl border ${getPriorityColor(announcement.priority)} hover:border-blue-500/50 transition-all duration-300`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getPriorityIcon(announcement.priority)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {announcement.title}
                    </h3>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-300">{announcement.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}