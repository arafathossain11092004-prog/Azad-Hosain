import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { IconRenderer } from './IconRenderer';

export function Contact() {
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'socialLinks'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setSocialLinks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Error fetching socialLinks:", error));
    return unsub;
  }, []);

  return (
    <footer id="contact" className="bg-[#050505] text-white relative py-24 md:py-32 flex flex-col items-center overflow-hidden">
      <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      
      <div className="max-w-4xl mx-auto px-4 w-full flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-6 relative inline-block">
            Get In Touch
          </h2>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mt-4 font-light">
            Ready to elevate your content? Reach out through any of the platforms below and let's create something extraordinary together.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-4 mb-20 max-w-3xl"
        >
          {socialLinks.length === 0 ? (
            <div className="text-neutral-500 font-light border border-neutral-900 rounded-full px-6 py-3">No contact methods configured yet.</div>
          ) : socialLinks.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.href}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900 transition-all duration-300 backdrop-blur-sm group"
            >
              <div className="text-white transition-transform group-hover:scale-110 duration-300">
                <IconRenderer name={link.iconName} className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm tracking-wide text-white">{link.name}</span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5, delay: 0.4 }}
           className="flex flex-col items-center"
        >
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#050505' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 bg-transparent border border-white/10 px-8 py-4 rounded-xl hover:border-white/30 transition-all duration-300"
          >
             <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zM6.924 15.02l.628-3.985a.64.64 0 0 1 .632-.54h2.49c3.048 0 5.37-.965 6.072-3.834.027-.11.053-.223.078-.342.19-1.25.048-2.072-.457-2.645-.583-.66-.184-1.139-1.236-1.574-.9-.353-2.112-.486-3.708-.486H6.702L3.633 21.02h3.291zm14.072-6.52c-.086.446-.206.877-.358 1.29-1.042 3.864-4.522 5.09-8.45 5.09h-1.63c-.524 0-.968.382-1.05.9l-.865 5.485h3.9c.524 0 .968-.382 1.05-.9l.716-4.542h1.164c4.103 0 7.31-1.666 8.246-6.495.046-.24.085-.483.118-.728H21z"/>
            </svg>
            <span className="text-white font-medium text-lg tracking-tight">Pay Via PayPal</span>
          </motion.button>
          <p className="text-neutral-500 text-xs mt-4 mt:font-medium tracking-wide font-light">
            Secure payment for editing services
          </p>
        </motion.div>

        <div className="mt-24 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-sm w-full font-light">
          <p>© <Link to="/admin" className="hover:text-white transition-colors">{new Date().getFullYear()}</Link> Azad Hossain. All rights reserved.</p>
          <p className="mt-4 md:mt-0 opacity-50 hover:opacity-100 transition-opacity">Designed & Dev By Arafat Hossain</p>
        </div>
      </div>
    </footer>
  );
}
