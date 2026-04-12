import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Apple } from 'lucide-react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import UploadBox from './components/UploadBox';
import ResultCard from './components/ResultCard';
import ChatUI from './components/ChatUI';
import DashboardCard from './components/DashboardCard';
import { FoodResult, MealRecord } from './types';

const DUMMY_RESULT: FoodResult = {
  name: "Avocado Toast with Egg",
  calories: 450,
  confidence: 0.96,
  nutrients: [
    { name: "Protein", amount: 18, unit: "g", percentage: 36, color: "#f97316" },
    { name: "Carbs", amount: 32, unit: "g", percentage: 11, color: "#facc15" },
    { name: "Fat", amount: 28, unit: "g", percentage: 43, color: "#ea580c" },
  ],
  predictions: [
    { name: "Avocado Toast", percentage: 96 },
    { name: "Poached Egg", percentage: 88 },
    { name: "Sourdough Bread", percentage: 72 },
  ]
};

const DUMMY_HISTORY: MealRecord[] = [
  { id: '1', name: 'Greek Yogurt Bowl', calories: 320, time: '08:30 AM' },
  { id: '2', name: 'Grilled Chicken Salad', calories: 540, time: '12:45 PM' },
  { id: '3', name: 'Protein Shake', calories: 210, time: '04:15 PM' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodResult | null>(null);
  
  // Real state for tracking calories and meals
  const [currentCalories, setCurrentCalories] = useState(1070);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [mealHistory, setMealHistory] = useState<MealRecord[]>(DUMMY_HISTORY);

  const handleAnalyze = (image: string) => {
    console.log('Analyzing image:', image.substring(0, 50) + '...');
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(DUMMY_RESULT);
    }, 2500);
  };

  const handleAddToLog = (result: FoodResult) => {
    const newMeal: MealRecord = {
      id: Date.now().toString(),
      name: result.name,
      calories: result.calories,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setCurrentCalories(prev => prev + result.calories);
    setMealHistory(prev => [newMeal, ...prev]);
    setAnalysisResult(null); // Clear result after adding
    setActiveTab('dashboard'); // Switch to dashboard to see progress
  };

  const handleDeleteMeal = (mealId: string) => {
    const mealToDelete = mealHistory.find(m => m.id === mealId);
    if (mealToDelete) {
      setCurrentCalories(prev => Math.max(0, prev - mealToDelete.calories));
      setMealHistory(prev => prev.filter(m => m.id !== mealId));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-20 pb-20">
            <HeroSection onStart={() => setActiveTab('analyzer')} />
            <div className="max-w-5xl mx-auto px-6">
              <div className="flex flex-col items-center text-center mb-12">
                <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-3">Insights</span>
                <h2 className="text-3xl font-bold font-display text-navy mb-4">Your Daily Overview</h2>
                <p className="text-base text-medium-gray max-w-xl font-medium">Track your nutritional progress and stay on top of your health goals with ease.</p>
              </div>
              <DashboardCard 
                currentCalories={currentCalories} 
                targetCalories={targetCalories} 
                history={mealHistory}
                onUpdateTarget={setTargetCalories}
                onDeleteMeal={handleDeleteMeal}
              />
            </div>
          </div>
        );
      case 'analyzer':
        return (
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-3">Main Feature</span>
              <h1 className="text-4xl font-bold font-display text-navy mb-4">Food Analyzer</h1>
              <p className="text-base text-medium-gray max-w-xl mx-auto font-medium">Upload a photo of your meal to identify ingredients and nutritional value instantly.</p>
            </div>
            <UploadBox onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            {analysisResult && (
              <ResultCard 
                result={analysisResult} 
                onAddToLog={handleAddToLog}
              />
            )}
          </div>
        );
      case 'chatbot':
        return (
          <div className="max-w-5xl mx-auto px-6 py-10">
            <ChatUI />
          </div>
        );
      case 'dashboard':
        return (
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-3">Statistics</span>
              <h1 className="text-4xl font-bold font-display text-navy mb-4">Health Dashboard</h1>
              <p className="text-base text-medium-gray max-w-xl mx-auto font-medium">A comprehensive view of your nutritional journey and historical data.</p>
            </div>
            <DashboardCard 
              currentCalories={currentCalories} 
              targetCalories={targetCalories} 
              history={mealHistory}
              onUpdateTarget={setTargetCalories}
              onDeleteMeal={handleDeleteMeal}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-primary-light/20">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-light-gray/50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-4">
              <div className="bg-primary p-2.5 rounded-xl shadow-md shadow-primary/20">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-display text-navy tracking-tight">AI Food <span className="text-primary">Calorie Analyzer</span></span>
            </div>
            <div className="flex gap-10 text-xs font-black text-medium-gray uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <div className="text-xs font-black text-medium-gray uppercase tracking-[0.2em]">
              © 2026 AI Food Calorie Analyzer.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
