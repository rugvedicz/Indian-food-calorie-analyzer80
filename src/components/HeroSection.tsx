import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Utensils, Coffee, Pizza } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
}

export default function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative pt-16 pb-24 overflow-hidden">
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[12%] left-[10%] text-primary/10"
        >
          <Pizza className="w-16 h-16" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[18%] right-[10%] text-primary/10"
        >
          <Coffee className="w-14 h-14" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -12, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[18%] left-[12%] text-primary/10"
        >
          <Utensils className="w-12 h-12" />
        </motion.div>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-light/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-primary-accent/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary-dark text-xs font-black uppercase tracking-[0.2em] mb-8 border border-primary/20 shadow-sm">
            <Sparkles className="w-4 h-4" />
            AI-Powered Nutrition Intelligence
          </span>
          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight text-navy mb-8 leading-tight">
            AI Food <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              Calorie Analyzer
            </span>
          </h1>
          <p className="text-lg text-medium-gray max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Understand your meals instantly with smart AI insights. Simply snap a photo and get detailed nutritional breakdowns in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={onStart}
              className="group relative btn-gradient px-8 py-4 rounded-2xl text-base font-black uppercase tracking-widest hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              Start Analyzing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: Zap, title: 'Instant Analysis', desc: 'Results in under 2 seconds using advanced neural networks.' },
            { icon: ShieldCheck, title: '98% Accuracy', desc: 'Trained on millions of food images for precise estimation.' },
            { icon: Sparkles, title: 'Smart Insights', desc: 'Personalized recommendations based on your goals.' },
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white border border-light-gray/30 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left group">
              <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:rotate-12 transition-all">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-navy">{feature.title}</h3>
              <p className="text-sm text-medium-gray leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
