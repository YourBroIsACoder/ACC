// src/components/Contact.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MessageCircle, Twitter, Linkedin, Github, Shield } from 'lucide-react'; 
import emailjs from '@emailjs/browser';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState < boolean > (false);
  const [success, setSuccess] = useState < boolean > (false);
  const [error, setError] = useState < boolean > (false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    setError(false);

    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('EmailJS Error:', err);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'agnelcybercell@gmail.com',
      link: 'mailto:agnelcybercell@gmail.com'
    },
  ];

  return (
    <section className="py-20 bg-gray-700/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get In <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about cybersecurity? Want to join our community? We'd love to hear from you.
          </p>
        </motion.div>

        {/* --- LAYOUT ROW 1: Contact (Left) and Contact Form (Right) --- */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* ======================= COLUMN 1: All Info & Image (Stacked) ======================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-6 flex flex-col justify-start"
          >
            {/* 1. COMBINED Reach Us & Follow Us Block */}
            <div className="p-6 bg-gray-800/50 rounded-xl relative">
              
              {/* --- Mask Image/Icon in Tilted Position --- */}
              <div className="absolute top-0 right-0 m-4 transform rotate-12">
                  <img 
                src="images/zero.png" 
                alt="grp photo" 
                className="max-h-20 object-contain "
              />
              </div>

              {/* Reach Us Content */}
              <h3 className="text-2xl font-bold text-white mb-6">Reach Us</h3>
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{info.title}</h4>
                      {info.link ? (
                        <a href={info.link} className="text-gray-400 hover:text-blue-400 transition-colors">
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-400">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Follow Us Content with Separator */}
              <div className="pt-4 border-t border-gray-700/50"> {/* Divider Line */}
                <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://twitter.com/yourhandle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="https://linkedin.com/in/yourhandle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="https://discord.gg/yourserver"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="https://github.com/yourhandle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Github className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>

            </div>
            
            {/* 2. Image Block (Sits below the combined box) */}
            <div className="p-6  rounded-xl flex justify-center flex-grow">
              <img 
                src="images/cute.png" 
                alt="grp photo" 
                className="max-h-75 object-contain "
              />
            </div>

          </motion.div>

          {/* ======================= COLUMN 2: Contact Form ======================= */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-800/50 p-6 rounded-xl"
          >
             <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                Send a Message <Shield className="w-6 h-6 ml-3 text-purple-400" /> 
             </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {['name', 'email', 'subject'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                    {field}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field as keyof FormData]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>

              {success && (
                <p className="text-green-400 text-sm mt-2">Message sent successfully! 🎉</p>
              )}
              {error && (
                <p className="text-red-400 text-sm mt-2">Something went wrong. Please try again.</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}