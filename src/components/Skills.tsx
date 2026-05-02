import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { Film, MonitorPlay, Video } from 'lucide-react';

const SKILLS = [
  { name: 'Premiere Pro', level: 95, icon: Video, color: 'from-purple-500 to-indigo-600' },
  { name: 'After Effects', level: 85, icon: Film, color: 'from-blue-400 to-blue-600' },
  { name: 'Cinema 4D', level: 75, icon: MonitorPlay, color: 'from-orange-400 to-red-500' },
];

function InteractiveIcon({ Icon, colorClass, delay }: { Icon: any, colorClass: string, delay: number }) {
  return (
    <motion.div
      animate={{
        y: [0, -15, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
      className={`w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-2xl shadow-neutral-900/50 relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white/20 blur-2xl transform -translate-x-full translate-y-full hover:translate-x-full hover:-translate-y-full transition-transform duration-1000" />
      <Icon className="w-10 h-10 md:w-16 md:h-16 text-white" />
    </motion.div>
  );
}

function ProgressBar({ name, level, index }: { key?: React.Key; name: string, level: number, index: number }) {
  const barRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(barRef, { once: true, margin: "-100px" });

  return (
    <div className="mb-8" ref={barRef}>
      <div className="flex justify-between mb-2">
        <span className="text-white font-semibold tracking-wide">{name}</span>
        <span className="text-neutral-400 font-mono">{isInView ? level : 0}%</span>
      </div>
      <div className="h-4 w-full bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.5, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
          className="h-full bg-red-500 rounded-full relative"
        >
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30" />
        </motion.div>
      </div>
    </div>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section id="about" ref={sectionRef} className="py-32 px-4 md:px-8 bg-neutral-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Progress Bars */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">
              The Arsenal
            </h2>
            <p className="text-neutral-400 text-lg mb-12 max-w-md">
              Combining industry-standard tools with an exceptional eye for detail to deliver premium visual experiences.
            </p>

            <div className="space-y-6">
              {SKILLS.map((skill, index) => (
                <ProgressBar key={skill.name} name={skill.name} level={skill.level} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Floating Icons */}
        <motion.div 
          style={{ y }} 
          className="relative h-[400px] flex items-center justify-center z-10"
        >
          <div className="absolute inset-0 bg-red-500/10 blur-[100px] rounded-full" />
          
          <div className="relative w-full max-w-sm aspect-square">
            <div className="absolute top-0 right-10">
              <InteractiveIcon Icon={SKILLS[0].icon} colorClass={SKILLS[0].color} delay={0} />
            </div>
            <div className="absolute bottom-10 right-20">
              <InteractiveIcon Icon={SKILLS[1].icon} colorClass={SKILLS[1].color} delay={0.5} />
            </div>
            <div className="absolute top-20 left-0">
              <InteractiveIcon Icon={SKILLS[2].icon} colorClass={SKILLS[2].color} delay={1} />
            </div>
          </div>
        </motion.div>

      </div>
      
      {/* Decorative background typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-neutral-800/30 whitespace-nowrap pointer-events-none select-none z-0">
        SKILLS & TOOLS
      </div>
    </section>
  );
}
