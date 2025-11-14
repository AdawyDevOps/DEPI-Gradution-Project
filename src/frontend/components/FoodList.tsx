import { Card } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Trash2, Coffee, Sun, Moon, Apple } from "lucide-react";
import { FoodEntry, MealType } from "./AddFoodForm";

interface FoodListProps {
  foods: FoodEntry[];
  onDeleteFood: (id: string) => void;
}

const getMealIcon = (mealType: MealType) => {
  switch (mealType) {
    case "breakfast":
      return <Coffee className="h-4 w-4" />;
    case "lunch":
      return <Sun className="h-4 w-4" />;
    case "dinner":
      return <Moon className="h-4 w-4" />;
    case "snack":
      return <Apple className="h-4 w-4" />;
  }
};

const getMealColor = (mealType: MealType) => {
  switch (mealType) {
    case "breakfast":
      return "bg-accent/10 text-accent-foreground";
    case "lunch":
      return "bg-primary/10 text-primary";
    case "dinner":
      return "bg-info/10 text-info";
    case "snack":
      return "bg-success/10 text-success";
  }
};

export const FoodList = ({ foods, onDeleteFood }: FoodListProps) => {
  const groupedFoods = foods.reduce((acc, food) => {
    if (!acc[food.mealType]) {
      acc[food.mealType] = [];
    }
    acc[food.mealType].push(food);
    return acc;
  }, {} as Record<MealType, FoodEntry[]>);

  const mealOrder: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

  return (
    <div className="space-y-6">
      {mealOrder.map((mealType) => {
        const mealFoods = groupedFoods[mealType];
        if (!mealFoods || mealFoods.length === 0) return null;

        const mealTotal = mealFoods.reduce((sum, food) => sum + food.calories, 0);

        return (
          <div key={mealType}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${getMealColor(mealType)}`}>
                  {getMealIcon(mealType)}
                </div>
                <h3 className="font-semibold capitalize text-lg">{mealType}</h3>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {mealTotal} cal
              </span>
            </div>
            <div className="space-y-2">
              {mealFoods.map((food) => (
                <Card key={food.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{food.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-muted-foreground">{food.calories} cal</p>
                        <p className="text-xs text-muted-foreground">
                          P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteFood(food.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {foods.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No food entries yet. Add your first meal above!</p>
        </Card>
      )}
    </div>
  );
};
