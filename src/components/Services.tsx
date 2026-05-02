import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { IconRenderer } from './IconRenderer';

export function Services() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  return (
    <section id="services" className="py-24 md:py-32 px-4 md:px-8 bg-[#030303] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <motion.h2 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
             className="text-4xl md:text-6xl font-light tracking-tight mb-6 relative inline-block"
          >
            Specialized Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-light mt-6"
          >
            Comprehensive post-production tailored to your brand's unique energy. From rough cut to final export.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full text-center text-neutral-500 font-light border border-neutral-900 rounded-2xl py-12">No services configured yet.</div>
          ) : services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-transparent border border-white/5 p-8 rounded-2xl hover:border-white/20 hover:bg-[#050505] transition-all duration-500 group cursor-pointer relative"
            >
              <div className="relative z-10">
                <div 
                  className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mb-8 group-hover:-translate-y-1 group-hover:border-[#F26B22] transition-all duration-300 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-neutral-400 group-hover:[&>svg]:text-[#F26B22] [&>svg]:transition-colors"
                  dangerouslySetInnerHTML={{ __html: service.svgCode || '<svg></svg>' }}
                />
                <h3 className="text-xl font-medium mb-4 tracking-tight">{service.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-sm font-light">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
