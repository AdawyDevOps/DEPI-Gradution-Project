import { Card } from "@/frontend/components/ui/card";
import { Progress } from "@/frontend/components/ui/progress";
import { Target, TrendingUp, Flame } from "lucide-react";

interface CalorieProgressProps {
  consumed: number;
  goal: number;
}

export const CalorieProgress = ({ consumed, goal }: CalorieProgressProps) => {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  const isOverGoal = consumed > goal;

  return (
    <Card className="p-6 shadow-lg bg-gradient-primary text-primary-foreground">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Today's Calories</h2>
          </div>
          <Target className="h-6 w-6 opacity-80" />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-5xl font-bold">{consumed}</span>
              <span className="text-xl ml-2 opacity-80">/ {goal}</span>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-80">Remaining</div>
              <div className="text-2xl font-semibold">
                {isOverGoal ? `+${consumed - goal}` : remaining}
              </div>
            </div>
          </div>

          <Progress 
            value={percentage} 
            className="h-3 bg-primary-foreground/20"
          />

          <div className="flex items-center justify-between text-sm opacity-90">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{percentage.toFixed(0)}% of goal</span>
            </div>
            {isOverGoal && (
              <span className="font-medium">Over goal!</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary-foreground/20">
          <div className="text-center">
            <div className="text-2xl font-bold">{goal}</div>
            <div className="text-xs opacity-80">Goal</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{consumed}</div>
            <div className="text-xs opacity-80">Consumed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{remaining}</div>
            <div className="text-xs opacity-80">Left</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
