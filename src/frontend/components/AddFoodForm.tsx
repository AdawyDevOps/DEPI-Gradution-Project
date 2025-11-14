import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/frontend/components/ui/select";
import { Card } from "@/frontend/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: MealType;
  timestamp: Date;
}

interface AddFoodFormProps {
  onAddFood: (food: Omit<FoodEntry, "id" | "timestamp">) => void;
}

export const AddFoodForm = ({ onAddFood }: AddFoodFormProps) => {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [mealType, setMealType] = useState<MealType>("breakfast");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName.trim() || !calories || !protein || !carbs || !fat) {
      toast.error("Please fill in all fields");
      return;
    }

    const calorieNum = parseInt(calories);
    const proteinNum = parseInt(protein);
    const carbsNum = parseInt(carbs);
    const fatNum = parseInt(fat);

    if (isNaN(calorieNum) || calorieNum <= 0) {
      toast.error("Please enter a valid calorie amount");
      return;
    }

    if (isNaN(proteinNum) || isNaN(carbsNum) || isNaN(fatNum)) {
      toast.error("Please enter valid macro amounts");
      return;
    }

    onAddFood({
      name: foodName.trim(),
      calories: calorieNum,
      protein: proteinNum,
      carbs: carbsNum,
      fat: fatNum,
      mealType,
    });

    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    toast.success("Food added successfully!");
  };

  return (
    <Card className="p-6 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="foodName">Food Name</Label>
          <Input
            id="foodName"
            placeholder="e.g., Grilled Chicken"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="calories">Calories</Label>
          <Input
            id="calories"
            type="number"
            placeholder="e.g., 250"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              placeholder="25"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input
              id="carbs"
              type="number"
              placeholder="30"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="fat">Fat (g)</Label>
            <Input
              id="fat"
              type="number"
              placeholder="10"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="mealType">Meal Type</Label>
          <Select value={mealType} onValueChange={(value) => setMealType(value as MealType)}>
            <SelectTrigger id="mealType" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Food
        </Button>
      </form>
    </Card>
  );
};
