import { Card } from "@/frontend/components/ui/card";
import { Progress } from "@/frontend/components/ui/progress";
import { Beef, Wheat, Droplet } from "lucide-react";

interface MacroProgressProps {
  protein: number;
  carbs: number;
  fat: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
}

export const MacroProgress = ({ 
  protein, 
  carbs, 
  fat,
  proteinGoal = 150,
  carbsGoal = 200,
  fatGoal = 65
}: MacroProgressProps) => {
  const proteinPercentage = Math.min((protein / proteinGoal) * 100, 100);
  const carbsPercentage = Math.min((carbs / carbsGoal) * 100, 100);
  const fatPercentage = Math.min((fat / fatGoal) * 100, 100);

  return (
    <Card className="p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Macros</h2>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Beef className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Protein</span>
            </div>
            <span className="text-sm font-medium">{protein}g / {proteinGoal}g</span>
          </div>
          <Progress value={proteinPercentage} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wheat className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Carbs</span>
            </div>
            <span className="text-sm font-medium">{carbs}g / {carbsGoal}g</span>
          </div>
          <Progress value={carbsPercentage} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-info" />
              <span className="text-sm font-medium">Fat</span>
            </div>
            <span className="text-sm font-medium">{fat}g / {fatGoal}g</span>
          </div>
          <Progress value={fatPercentage} className="h-2" />
        </div>
      </div>
    </Card>
  );
};
