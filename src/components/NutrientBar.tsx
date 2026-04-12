import { motion } from 'motion/react';
import { Nutrient } from '../types';

interface NutrientBarProps {
  nutrient: Nutrient;
}

export default function NutrientBar({ nutrient }: NutrientBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-3">
        <div>
          <span className="text-base font-bold text-navy">{nutrient.name}</span>
          <span className="text-xs font-black text-medium-gray ml-4 uppercase tracking-[0.1em]">
            {nutrient.amount}{nutrient.unit}
          </span>
        </div>
        <span className="text-base font-black text-primary">{nutrient.percentage}%</span>
      </div>
      <div className="h-3 w-full bg-primary-light/30 rounded-full overflow-hidden shadow-inner border border-primary/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${nutrient.percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full shadow-sm relative overflow-hidden"
          style={{ 
            background: `linear-gradient(90deg, ${nutrient.color}dd, ${nutrient.color})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}
