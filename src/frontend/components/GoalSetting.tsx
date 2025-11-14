import { useState } from "react";
import { Card } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/frontend/components/ui/select";
import { Settings, Calculator } from "lucide-react";
import { toast } from "sonner";

interface GoalSettingProps {
  currentGoal: number;
  onUpdateGoal: (newGoal: number) => void;
}

export const GoalSetting = ({ currentGoal, onUpdateGoal }: GoalSettingProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [goalInput, setGoalInput] = useState(currentGoal.toString());
  
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [goalType, setGoalType] = useState<"cut" | "bulk" | "maintain">("maintain");

  const calculateCalories = () => {
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum) || ageNum <= 0 || weightNum <= 0 || heightNum <= 0) {
      toast.error("Please enter valid values for all fields");
      return;
    }

    // Mifflin-St Jeor Equation for BMR
    let bmr;
    if (gender === "male") {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    // Activity multipliers
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    // Adjust for goal
    let targetCalories;
    if (goalType === "cut") {
      targetCalories = Math.round(tdee - 500); // 500 calorie deficit
    } else if (goalType === "bulk") {
      targetCalories = Math.round(tdee + 300); // 300 calorie surplus
    } else {
      targetCalories = Math.round(tdee);
    }

    onUpdateGoal(targetCalories);
    setShowCalculator(false);
    setIsEditing(false);
    toast.success(`Daily goal calculated: ${targetCalories} calories`);
  };

  const handleSave = () => {
    const newGoal = parseInt(goalInput);
    if (isNaN(newGoal) || newGoal <= 0) {
      toast.error("Please enter a valid calorie goal");
      return;
    }
    onUpdateGoal(newGoal);
    setIsEditing(false);
    toast.success("Daily goal updated!");
  };

  if (!isEditing && !showCalculator) {
    return (
      <Card className="p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Daily Goal</p>
              <p className="text-lg font-semibold">{currentGoal} calories</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowCalculator(true)}>
              <Calculator className="h-4 w-4 mr-1" />
              Calculate
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (showCalculator) {
    return (
      <Card className="p-4 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Calculate Your Calorie Goal</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={(value: "male" | "female") => setGender(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="activity">Activity Level</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (2x per day)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="goalType">Goal</Label>
            <Select value={goalType} onValueChange={(value: "cut" | "bulk" | "maintain") => setGoalType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cut">Cut (lose weight)</SelectItem>
                <SelectItem value="maintain">Maintain weight</SelectItem>
                <SelectItem value="bulk">Bulk (gain weight)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={calculateCalories} className="flex-1">Calculate Goal</Button>
            <Button variant="outline" onClick={() => setShowCalculator(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 shadow-sm">
      <div className="space-y-3">
        <Label htmlFor="goalInput">Daily Calorie Goal</Label>
        <div className="flex gap-2">
          <Input
            id="goalInput"
            type="number"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="e.g., 2000"
          />
          <Button onClick={handleSave}>Save</Button>
          <Button variant="outline" onClick={() => {
            setGoalInput(currentGoal.toString());
            setIsEditing(false);
          }}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};
