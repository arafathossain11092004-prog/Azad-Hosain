import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';

export function About() {
  const [profile, setProfile] = useState({
    name: 'Azad Hossain',
    bio: "A passionate video editor and motion designer. I combine technical precision with creative storytelling to deliver visuals that don't just look good — they perform.",
    yearsExperience: '4+',
    projectsDelivered: '50+',
    clientSatisfaction: '100%',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300'
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'profile', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as any);
      }
    }, (error) => console.error("Error fetching about profile:", error));
    return unsub;
  }, []);
  return (
    <section id="about" className="py-32 px-4 md:px-8 bg-black text-white relative overflow-hidden border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-light text-center mb-16 md:mb-24 tracking-tight"
        >
          About Me
        </motion.h2>
        
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center md:items-start">
          {/* Left: Portrait */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 relative"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full p-[1px] bg-neutral-800 relative z-10 transition-transform hover:scale-105 duration-500">
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-[8px] border-black">
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-3xl tracking-tight font-medium mb-4">{profile.name}</h3>
              <p className="text-neutral-400 font-light leading-relaxed mb-10 text-lg">
                {profile.bio}
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { label: "Years Experience", value: profile.yearsExperience },
                { label: "Projects Delivered", value: profile.projectsDelivered },
                { label: "Client Satisfaction", value: profile.clientSatisfaction }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                  className="bg-[#050505] border border-neutral-900 rounded-xl p-4 md:p-6 text-center hover:border-neutral-700 transition-colors duration-300 relative overflow-hidden group"
                >
                  <div className="text-2xl md:text-3xl font-light text-white mb-2 relative z-10 group-hover:text-[#F26B22] transition-colors">{stat.value}</div>
                  <div className="text-[9px] md:text-xs font-medium text-neutral-500 uppercase tracking-widest relative z-10">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
