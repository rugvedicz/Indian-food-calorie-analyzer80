import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MealRecord } from '../types';
import { Calendar, Clock, Flame, TrendingUp, Edit2, Check, X, Trash2 } from 'lucide-react';

interface DashboardCardProps {
  currentCalories: number;
  targetCalories: number;
  history: MealRecord[];
  onUpdateTarget?: (newTarget: number) => void;
  onDeleteMeal?: (mealId: string) => void;
}

export default function DashboardCard({ currentCalories, targetCalories, history, onUpdateTarget, onDeleteMeal }: DashboardCardProps) {
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(targetCalories.toString());

  const percentage = Math.min((currentCalories / targetCalories) * 100, 100);
  const remaining = Math.max(targetCalories - currentCalories, 0);

  const handleSaveTarget = () => {
    const val = parseInt(tempTarget);
    if (!isNaN(val) && val > 0) {
      onUpdateTarget?.(val);
      setIsEditingTarget(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {/* Daily Progress */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-1 bg-white p-8 rounded-[2rem] shadow-xl border border-light-gray/30 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-2xl font-bold text-navy">Daily Progress</h3>
          <div className="flex items-center gap-2">
            {isEditingTarget ? (
              <div className="flex items-center gap-1 bg-light-gray/20 rounded-lg p-1">
                <input 
                  type="number" 
                  value={tempTarget}
                  onChange={(e) => setTempTarget(e.target.value)}
                  className="w-16 bg-transparent text-xs font-bold text-navy outline-none px-1"
                  autoFocus
                />
                <button onClick={handleSaveTarget} className="p-1 hover:text-primary transition-colors">
                  <Check className="w-3 h-3" />
                </button>
                <button onClick={() => { setIsEditingTarget(false); setTempTarget(targetCalories.toString()); }} className="p-1 hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditingTarget(true)}
                className="p-2 hover:bg-light-gray/30 rounded-xl transition-all text-medium-gray hover:text-primary flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Set Goal</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-light-gray/20 stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            ></circle>
            <motion.circle
              className="text-primary stroke-current"
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              initial={{ strokeDasharray: "0 251" }}
              animate={{ strokeDasharray: `${(percentage / 100) * 251} 251` }}
              transition={{ duration: 2, ease: "circOut" }}
            ></motion.circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-navy">{currentCalories}</span>
            <span className="text-xs font-black text-medium-gray uppercase tracking-[0.1em] mt-1">of {targetCalories} kcal</span>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="p-5 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-between border border-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Remaining</span>
                <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Calories to eat</span>
              </div>
            </div>
            <span className="text-xl font-black text-white">{remaining} kcal</span>
          </div>
        </div>
      </motion.div>

      {/* Meal History */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-xl border border-light-gray/30"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-navy">Recent Meals</h3>
          <button className="text-xs font-black text-primary hover:text-primary-dark transition-all uppercase tracking-widest hover:underline underline-offset-4">
            Full History
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {history.map((meal, i) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-white border border-light-gray/50 hover:border-primary/40 hover:shadow-md hover:shadow-navy/5 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-primary-light/50 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all shadow-inner group-hover:rotate-6">
                    <Clock className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-navy group-hover:text-primary transition-colors">{meal.name}</h4>
                    <p className="text-xs font-black text-medium-gray uppercase tracking-widest mt-0.5">{meal.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="text-right">
                    <div className="text-xl font-black text-navy">+{meal.calories}</div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">kcal</div>
                  </div>
                  <button 
                    onClick={() => onDeleteMeal?.(meal.id)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm"
                    title="Remove meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {history.length === 0 && (
            <div className="text-center py-10">
              <p className="text-medium-gray font-medium">No meals logged yet today.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
