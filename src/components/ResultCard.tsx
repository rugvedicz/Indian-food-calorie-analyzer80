import { motion } from 'motion/react';
import { FoodResult } from '../types';
import NutrientBar from './NutrientBar';
import { CheckCircle2, Flame, Info } from 'lucide-react';

interface ResultCardProps {
  result: FoodResult;
  onAddToLog: (result: FoodResult) => void;
}

export default function ResultCard({ result, onAddToLog }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-10"
    >
      <div className="bg-white rounded-[2rem] shadow-xl shadow-navy/10 border border-light-gray/50 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 bg-gradient-to-br from-primary-light to-transparent border-b border-light-gray/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] mb-3">
                <CheckCircle2 className="w-5 h-5" />
                Analysis Complete
              </div>
              <h2 className="text-4xl font-bold font-display text-navy leading-tight">{result.name}</h2>
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl shadow-lg border border-light-gray/50 flex flex-col items-center min-w-[100px]">
              <span className="text-[10px] font-black text-medium-gray uppercase tracking-[0.1em] mb-2">Confidence</span>
              <span className="text-2xl font-black text-primary">{(result.confidence * 100).toFixed(0)}%</span>
              <div className="w-full h-1.5 bg-light-gray/30 rounded-full mt-2 overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${result.confidence * 100}%` }}
                   className="h-full bg-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/40 rotate-3">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-navy">{result.calories}</div>
                <div className="text-xs font-black text-medium-gray uppercase tracking-[0.1em]">Calories (kcal)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrients Section */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-navy">Macronutrients</h3>
            <button className="text-medium-gray hover:text-primary transition-colors p-2 hover:bg-light-gray/30 rounded-xl">
              <Info className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-8">
            {result.nutrients.map((nutrient, index) => (
              <div key={index}>
                <NutrientBar nutrient={nutrient} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-light-gray/20">
          <button 
            onClick={() => onAddToLog(result)}
            className="w-full btn-gradient py-4 rounded-xl font-bold text-base hover:scale-[1.02] active:scale-[0.98]"
          >
            Add to Daily Log
          </button>
        </div>
      </div>
    </motion.div>
  );
}
