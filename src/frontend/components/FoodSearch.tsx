import { useState } from "react";
import { Card } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Button } from "@/frontend/components/ui/button";
import { Search, Plus } from "lucide-react";
import { FoodEntry, MealType } from "./AddFoodForm";
import { toast } from "sonner";

interface FoodSearchProps {
  onAddFood: (food: Omit<FoodEntry, "id" | "timestamp">) => void;
  mealType: MealType;
}

const commonFoods = [
  { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fat: 2 },
  { name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "Broccoli (1 cup)", calories: 55, protein: 4, carbs: 11, fat: 1 },
  { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: "Greek Yogurt (1 cup)", calories: 100, protein: 17, carbs: 6, fat: 0 },
  { name: "Avocado", calories: 240, protein: 3, carbs: 13, fat: 22 },
  { name: "Eggs (2 large)", calories: 140, protein: 12, carbs: 1, fat: 10 },
  { name: "Oatmeal (1 cup)", calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: "Sweet Potato (medium)", calories: 103, protein: 2, carbs: 24, fat: 0 },
  { name: "Almonds (28g)", calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: "Apple", calories: 95, protein: 0, carbs: 25, fat: 0 },
  { name: "Whole Wheat Bread (2 slices)", calories: 160, protein: 8, carbs: 28, fat: 2 },
  { name: "Tuna (100g)", calories: 132, protein: 28, carbs: 0, fat: 1 },
  { name: "Peanut Butter (2 tbsp)", calories: 188, protein: 8, carbs: 7, fat: 16 },
];

export const FoodSearch = ({ onAddFood, mealType }: FoodSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFoods = commonFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFood = (food: typeof commonFoods[0]) => {
    onAddFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      mealType,
    });
    toast.success(`${food.name} added!`);
  };

  return (
    <Card className="p-4 shadow-md">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search common foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {filteredFoods.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No foods found
            </p>
          ) : (
            filteredFoods.map((food, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{food.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {food.calories} cal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAddFood(food)}
                  className="ml-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
