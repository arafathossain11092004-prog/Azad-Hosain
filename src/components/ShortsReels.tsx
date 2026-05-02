import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';

function ShortVideoCard({ project, index }: { project: any; index: number }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "200px" });

  useEffect(() => {
    if (isInView && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Auto-play was prevented", error);
        });
      }
    }
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-neutral-900 cursor-pointer shadow-2xl"
    >
      <img
        src={project.thumbnailUrl || project.thumbnail}
        alt={project.title}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
          isVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />

      {isInView && (
        <video
          ref={videoRef}
          src={project.videoUrl}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          onCanPlay={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <div className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3 self-start">
          {project.category}
        </div>
        <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight">
          {project.title}
        </h3>
      </div>
    </div>
  );
}

export function ShortsReels() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'videos'), where('type', '==', 'short-form'));
    const unsub = onSnapshot(q, (snapshot) => {
      const vids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      vids.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      setVideos(vids);
    });
    return unsub;
  }, []);

  // For the marquee effect to work, we need a list to duplicate. If empty, just show empty state.
  if (videos.length === 0) {
    return (
      <section id="portfolio" className="py-24 md:py-32 bg-[#030303] text-white relative flex flex-col items-center border-t border-white/5">
         <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-4 text-center">
            Reels & Shorts <span className="text-[#F26B22] text-2xl md:text-4xl align-top font-medium">(9:16)</span>
          </h2>
         <p className="text-neutral-500 mt-8 border border-neutral-900 rounded-2xl p-8 max-w-xl text-center font-light">No short-form videos added yet. Add some in the Admin Dashboard!</p>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-[#030303] text-white relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-16 md:mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
              Reels & Shorts <span className="text-[#F26B22] text-2xl md:text-4xl align-top font-medium">(9:16)</span>
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto font-light">
              High-retention vertical videos optimized for TikTok, Instagram Reels, and YouTube Shorts. 
              Designed to stop the scroll and drive engagement.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Marquee Container */}
      <div 
        className="relative w-full flex align-center overflow-hidden pb-12"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
      >
        <motion.div
          className="flex gap-4 md:gap-8 min-w-max px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {/* Duplicate the videos twice to create a seamless infinite loop */}
          {[...videos, ...videos].map((project, index) => (
            <div key={`${project.id}-${index}`} className="w-[60vw] sm:w-[40vw] md:w-[25vw] lg:w-[20vw] flex-shrink-0">
              <ShortVideoCard project={project} index={index} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
