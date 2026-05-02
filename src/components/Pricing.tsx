import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';

export function Pricing() {
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'packages'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setPackages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Error fetching packages:", error));
    return unsub;
  }, []);

  return (
    <section id="pricing" className="py-24 md:py-32 px-4 md:px-8 bg-black text-white relative">
      {/* Background glow for popular card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#F26B22]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center">
          <motion.h2 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
             className="text-4xl md:text-6xl font-light tracking-tight mb-6 relative inline-block"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mt-6 font-light"
          >
            Invest in high-retention editing that pays back in views and engagement. Quality guaranteed.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {packages.length === 0 ? (
            <div className="col-span-full text-center text-neutral-500 font-light border border-neutral-900 rounded-2xl py-12">No pricing packages configured yet.</div>
          ) : packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 ${
                pkg.popular 
                  ? 'bg-[#050505] border border-[#F26B22]/50 shadow-2xl shadow-[#F26B22]/5 md:-translate-y-4 lg:scale-105 hover:border-[#F26B22]' 
                  : 'bg-transparent border border-white/5 hover:border-white/20 hover:-translate-y-2 hover:bg-[#030303]'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F26B22] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-5 rounded-full shadow-lg shadow-[#F26B22]/20">
                  Most Popular
                </div>
              )}

              
              <div className="mb-8">
                <h3 className="text-2xl font-medium mb-2">{pkg.name}</h3>
                <p className="text-neutral-400 text-sm h-10 font-light">{pkg.description}</p>
              </div>
              
              <div className="mb-8 flex items-end gap-1">
                <span className="text-5xl font-light tracking-tight">{pkg.price}</span>
                <span className="text-neutral-500 font-medium mb-1">{pkg.interval}</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {pkg.features && pkg.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${pkg.popular ? 'text-[#F26B22]' : 'text-neutral-600'}`} />
                    <span className="text-neutral-300 text-sm font-light">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-4 rounded-xl font-medium transition-all ${
                  pkg.popular 
                    ? 'bg-white text-black hover:bg-neutral-200' 
                    : 'bg-neutral-900 border border-white/5 text-white hover:bg-neutral-800'
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
