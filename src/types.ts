export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentage: number;
  color: string;
}

export interface FoodResult {
  name: string;
  calories: number;
  confidence: number;
  nutrients: Nutrient[];
  predictions: { name: string; percentage: number }[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface MealRecord {
  id: string;
  name: string;
  calories: number;
  time: string;
}
