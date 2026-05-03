import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { collection, onSnapshot, query, where, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';

interface VideoCardProps {
  key?: React.Key;
  project: {
    id: string | number;
    title: string;
    category: string;
    videoUrl: string;
    thumbnailUrl?: string;
    thumbnail?: string;
  };
  index: number;
}

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
};

function VideoCard({ project, index }: VideoCardProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "200px" });

  const youtubeId = getYouTubeId(project.videoUrl);

  useEffect(() => {
    if (videoRef.current && !youtubeId) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.log("Auto-play prevented", error));
      }
    }
  }, [youtubeId]);

  const thumbnailUrl = project.thumbnailUrl || project.thumbnail;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative rounded-xl overflow-hidden aspect-video bg-neutral-900 cursor-pointer"
    >
      {/* Thumbnail */}
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={project.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 scale-105 group-hover:scale-100 ${
            isVideoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          onError={(e) => {
            if (youtubeId && e.currentTarget.src.includes('maxresdefault')) {
              e.currentTarget.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
            }
          }}
        />
      )}

      {/* Video / YouTube Iframe */}
      {isInView && (
        youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&playsinline=1`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none scale-105 opacity-100`}
            allow="autoplay; encrypted-media"
            frameBorder="0"
            onLoad={() => setIsVideoLoaded(true)}
          />
        ) : (
          <video
            ref={videoRef}
            src={project.videoUrl}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            onCanPlay={() => setIsVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100`}
          />
        )
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <div className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3 self-start shadow-sm">
          {project.category}
        </div>
        <h3 className="text-white text-3xl font-light tracking-tight">
          {project.title}
        </h3>
      </div>
    </motion.div>
  );
}

export function ProjectGrid() {
  const [videos, setVideos] = useState<any[]>([]);
  const [youtubeLink, setYoutubeLink] = useState('https://youtube.com');

  useEffect(() => {
    return onSnapshot(doc(db, 'config', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.youtubeLink) setYoutubeLink(data.youtubeLink);
      }
    }, (error) => console.error("Error fetching config for youtubeLink:", error));
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'videos'), where('type', '==', 'long-form'));
    const unsub = onSnapshot(q, (snapshot) => {
      const vids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      vids.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      setVideos(vids);
    }, (error) => console.error("Error fetching project grid videos:", error));
    return unsub;
  }, []);

  return (
    <section id="long-form" className="py-32 px-4 md:px-8 bg-transparent text-white relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
              Long-Form <span className="text-[#F26B22] text-2xl md:text-4xl align-top font-medium">(16:9)</span>
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl max-w-xl font-light">
              Highlighting recent projects spanning across various industries and styles.
              Hover over a project to watch an instant preview.
            </p>
          </div>
          <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="text-white border-b-2 border-white/20 pb-1 font-medium hover:border-white transition-colors tracking-wider text-sm flex-shrink-0 self-start md:self-auto uppercase">
            View All Projects
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {videos.length > 0 ? videos.map((project, index) => (
            <VideoCard key={project.id} project={project} index={index} />
          )) : (
            <div className="col-span-full py-12 text-center text-neutral-500 border border-neutral-900 rounded-2xl">
              No long-form videos added yet. Add some in the Admin Dashboard!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
