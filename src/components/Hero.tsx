import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { VIDEOS } from '../utils/data';
import { VideoModal } from './VideoModal';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoCvUrl, setVideoCvUrl] = useState(VIDEOS.showreel);
  const [heroTitle, setHeroTitle] = useState('Azad Hossain');
  const [heroSubtitle, setHeroSubtitle] = useState('Video Editor & Motion Designer');
  const [heroDescription, setHeroDescription] = useState('I craft high-retention, aesthetically driven visual experiences. Transforming simple footage into cinematic motion design that demands attention.');

  useEffect(() => {
    return onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.videoCvUrl) setVideoCvUrl(data.videoCvUrl);
        if (data.heroTitle) {
          setHeroTitle(data.heroTitle);
          document.title = `${data.heroTitle} - ${data.heroSubtitle || 'Portfolio'}`;
        }
        if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
        if (data.heroDescription) setHeroDescription(data.heroDescription);
      }
    }, (error) => console.error("Error fetching config in Hero:", error));
  }, []);

  const titleWords = heroTitle.trim().split(' ');
  const lastWord = titleWords.length > 1 ? titleWords.pop() : '';
  const firstWords = titleWords.join(' ');

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video Loop */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src={VIDEOS.background}
        />
      </div>

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-md mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F26B22] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F26B22]"></span>
            </span>
            <span className="text-xs font-semibold tracking-widest text-[#F26B22] uppercase">Available for work</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 uppercase leading-[1.1]">
            <span className="block text-neutral-500 font-light text-2xl md:text-3xl mb-4 tracking-normal normal-case">{heroSubtitle}</span>
            {firstWords} {lastWord && <span className="text-[#F26B22]">{lastWord}</span>}
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 font-light mb-12 max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap">
            {heroDescription}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Play fill="currentColor" className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Play Video CV</span>
          </button>
          
          <a
            href="#contact"
            className="group relative flex items-center justify-center gap-3 bg-transparent border border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg overflow-hidden transition-all hover:bg-white/5 active:scale-95 w-full sm:w-auto"
          >
            <span className="relative z-10">Get In Touch</span>
          </a>
        </motion.div>
      </div>

      {/* Down Indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-neutral-500 text-xs tracking-[0.2em] font-medium uppercase flex flex-col items-center gap-3"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span>Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-neutral-500 to-transparent"></div>
      </motion.div>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={videoCvUrl}
      />
    </section>
  );
}
