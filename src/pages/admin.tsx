// src/pages/Admin.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/firebase';
import { UserPlus, Search, Trash2 } from 'lucide-react';

// --- FINAL DATA INTERFACE ---
// This now perfectly matches your Firestore structure. No 'addedAt'.
interface Member {
  id: string; 
  name?: string;
  dept?: string;
  year?: string;
  isMember?: boolean;
}

export default function Admin() {
  // State for the form
  const [newMember, setNewMember] = useState<Omit<Member, 'id'>>({ name: '', dept: '', year: '', isMember: true });
  const [memberNumber, setMemberNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // State for the list and search
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingList, setIsLoadingList] = useState(true);

  // --- FINAL FETCH LOGIC ---
  // Fetches all documents and sorts them by name on the client-side.
  useEffect(() => {
    const unsubscribe = db.collection('members').onSnapshot(snapshot => {
      const memberData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Member));
      
      // Sort by name (case-insensitive) after fetching
      memberData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      setAllMembers(memberData);
      setFilteredMembers(memberData);
      setIsLoadingList(false);
    }, error => {
      console.error('Error fetching members:', error);
      setIsLoadingList(false);
    });
    return () => unsubscribe();
  }, []);

  // Defensive filter logic (this is correct)
  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = allMembers.filter(member => {
      const memberName = (member.name || '').toLowerCase();
      const memberId = member.id || '';
      return memberName.includes(lowercasedFilter) || memberId.includes(lowercasedFilter);
    });
    setFilteredMembers(filtered);
  }, [searchTerm, allMembers]);

  // Form input handler (this is correct)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'memberNumber') setMemberNumber(value);
    else setNewMember(prevState => ({ ...prevState, [name]: value }));
  };

  // --- FINAL ADD MEMBER LOGIC ---
  // This function no longer tries to add the 'addedAt' field.
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberNumber.trim() || memberNumber.length !== 12 || !newMember.name || !newMember.dept || !newMember.year) {
      setMessage({ text: 'All fields, including a 12-digit number, are required.', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    try {
      const docRef = db.collection('members').doc(memberNumber);
      const doc = await docRef.get();
      if (doc.exists) {
        setMessage({ text: 'This member number already exists.', type: 'error' });
      } else {
        // This object now perfectly matches your existing document structure.
        const memberDataToSave = {
          name: newMember.name,
          dept: newMember.dept,
          year: newMember.year,
          isMember: true,
        };
        await docRef.set(memberDataToSave);
        setMessage({ text: 'Member added successfully!', type: 'success' });
        setMemberNumber('');
        setNewMember({ name: '', dept: '', year: '', isMember: true });
      }
    } catch (err) {
      setMessage({ text: 'Error adding member.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete function (this is correct)
  const handleDeleteMember = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete member ${id}?`)) {
      await db.collection('members').doc(id).delete();
    }
  };

  return (
    <section className="py-20 bg-gray-900/50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* All your JSX for the Header, Form, and Table are correct. */}
        {/* No changes are needed in the return() block. */}
        {/* ... */}
         <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Admin <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Panel</span></h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Manage club members and newsletter access.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><UserPlus className="mr-3" /> Add New Member</h2>
          <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input name="memberNumber" type="text" placeholder="12-Digit Member Number" value={memberNumber} onChange={handleInputChange} maxLength={12} className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isSubmitting} />
            <input name="name" type="text" placeholder="Full Name" value={newMember.name} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isSubmitting} />
            <input name="dept" type="text" placeholder="Department (e.g., CSE)" value={newMember.dept} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isSubmitting} />
            <input name="year" type="text" placeholder="Year (e.g., 2nd)" value={newMember.year} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isSubmitting} />
            <button type="submit" className="lg:col-span-4 py-3 px-6 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-900" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </button>
            {message.text && <p className={`lg:col-span-4 text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message.text}</p>}
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Current Members ({filteredMembers.length})</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input type="text" placeholder="Search by name or number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-80 p-3 pl-10 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="p-4">Member Number</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Year</th>
                  <th className="p-4 text-center">Is Active</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingList ? (
                  <tr><td colSpan={6} className="p-4 text-center text-gray-400">Loading members...</td></tr>
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <tr key={member.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="p-4 font-mono">{member.id}</td>
                      <td className="p-4 font-semibold">{member.name || <span className="text-yellow-500/80">N/A</span>}</td>
                      <td className="p-4">{member.dept || <span className="text-yellow-500/80">N/A</span>}</td>
                      <td className="p-4">{member.year || <span className="text-yellow-500/80">N/A</span>}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${member.isMember ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {typeof member.isMember === 'boolean' ? (member.isMember ? 'YES' : 'NO') : <span className="text-yellow-500/80">N/A</span>}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeleteMember(member.id)} className="p-2 text-red-500 hover:text-red-400 hover:bg-red-900/50 rounded-full transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="p-4 text-center text-gray-400">No members found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}