// src/pages/JoinUs.tsx

import { motion } from 'framer-motion';
import { Badge, BookOpen, Crown, Gamepad2, Layers, Rocket, Users, MessageSquare } from 'lucide-react';

// --- NEW DATA FOR YOUR PERKS ---
// This is structured to look great in the new layout.
const newPerks = [
  {
    icon: <BookOpen className="h-8 w-8 text-orange-400" />,
    title: 'Tech Mag & Newsletter – Members Only',
    description: 'Get our exclusive cyber-mag with weekly tech updates and insights. Members can submit articles and win "Article of the Week" fame.',
  },
  {
    icon: <Layers className="h-8 w-8 text-green-400" />,
    title: 'Premium Goodies',
    description: 'Receive exclusive stickers, collectibles, and other merch that gives you that "only members have this" vibe.',
  },
  {
    icon: <Gamepad2 className="h-8 w-8 text-purple-400" />,
    title: 'TryHackMe CTF Room Access',
    description: 'Access a private room with weekly cybersecurity challenges. Difficulty ramps up for a final challenge with rewards for the top 3 hackers.',
  },
  {
    icon: <Rocket className="h-8 w-8 text-blue-400" />,
    title: 'Event Discounts',
    description: 'Pay less for all Agnel Cybercell workshops, competitions, and our flagship events throughout the year.',
  },
];

export default function JoinUs() {
  return (
    <main className="py-20 bg-gray-700/50 text-white min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 pt-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Become an Official <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Cybercell Member</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Want in on the inner circle? Unlock skills, perks, and bragging rights that last the whole year.
          </p>
        </motion.div>
        
        {/* --- NEW Membership Process Section --- */}
        <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">How to Join (It's Easy!)</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                {/* Step 1 */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <div className="text-5xl font-bold text-blue-400 mb-2">1</div>
                    <h3 className="text-xl font-semibold mb-2">Pay & Lock Your Spot</h3>
                    <p className="text-gray-400">The membership fee is just ₹100 for a 1-year validity. Payment is online only – the link will be shared at events and on our socials.</p>
                </motion.div>
                {/* Step 2 */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <div className="text-5xl font-bold text-purple-400 mb-2">2</div>
                    <h3 className="text-xl font-semibold mb-2">Claim Your Badge</h3>
                    <p className="text-gray-400">Get your exclusive Cybercell Membership Badge – your golden ticket to all member-only perks and events.</p>
                </motion.div>
                {/* Step 3 */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <div className="text-5xl font-bold text-green-400 mb-2">3</div>
                    <h3 className="text-xl font-semibold mb-2">Enjoy VIP Perks</h3>
                    <p className="text-gray-400">You’re not just in the club… you are the club. Get ready for exclusive access and benefits.</p>
                </motion.div>
            </div>
        </div>
        

        {/* --- NEW Perks Section --- */}
        <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Your VIP Perks</h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
                {newPerks.map((perk, index) => (
                    <motion.div
                        key={perk.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex items-start gap-4"
                    >
                        <div className="flex-shrink-0 mt-1">{perk.icon}</div>
                        <div>
                            <h3 className="text-xl font-semibold mb-1">{perk.title}</h3>
                            <p className="text-gray-400">{perk.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
        <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.4 }}
    className="text-center mt-8"
>
    <a
        href="YOUR_GOOGLE_FORM_LINK_HERE" // <-- PASTE YOUR MEMBERSHIP FORM LINK
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block py-4 px-10 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
    >
        Click Here for Membership
    </a>
</motion.div>
<br></br>
<br></br>

        {/* --- NEW Core Team Section --- */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-blue-900/50 p-10 rounded-2xl text-center border border-purple-700/50"
        >
            <Crown className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Join the Core Team!</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Think you’ve got the skills, passion, and dedication to help run one of the coolest student cyber clubs? Here’s how to get in.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="text-left">
                    <p className="font-semibold">1. Join our WhatsApp Announcement Group.</p>
                    <p className="font-semibold">2. We’ll circulate the application form there when recruitment opens.</p>
                    <p className="font-semibold">3. Fill it out and tell us why you belong on the team!</p>
                </div>
                <a
                    href="https://chat.whatsapp.com/HIJ6826NCZsG4YQBuXNDPA?mode=ac_t" // <-- PASTE WHATSAPP LINK
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all transform hover:scale-105"
                >
                    <MessageSquare size={20} />
                    Join WhatsApp Group
                </a>
            </div>
            <p className="text-sm text-yellow-500 mt-6">⚡ Pro tip: Core Team spots are limited, so stay active and keep an eye on announcements!</p>
        </motion.div>
      </div>
    </main>
  );
}