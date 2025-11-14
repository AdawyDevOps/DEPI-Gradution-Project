import { useState, useEffect } from "react";
import { AddFoodForm, FoodEntry, MealType } from "@/frontend/components/AddFoodForm";
import { FoodList } from "@/frontend/components/FoodList";
import { CalorieProgress } from "@/frontend/components/CalorieProgress";
import { GoalSetting } from "@/frontend/components/GoalSetting";
import { MacroProgress } from "@/frontend/components/MacroProgress";
import { FoodSearch } from "@/frontend/components/FoodSearch";
import { Button } from "@/frontend/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { Utensils, Calendar, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/backend/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [currentMealType, setCurrentMealType] = useState<MealType>("breakfast");

  // Load user-specific data from localStorage
  useEffect(() => {
    if (currentUser) {
      const savedGoal = localStorage.getItem(`${currentUser}_dailyGoal`);
      const savedFoods = localStorage.getItem(`${currentUser}_foods`);
      
      if (savedGoal) {
        setDailyGoal(Number(savedGoal));
      }
      if (savedFoods) {
        setFoods(JSON.parse(savedFoods));
      }
    }
  }, [currentUser]);

  // Save data when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${currentUser}_dailyGoal`, dailyGoal.toString());
      localStorage.setItem(`${currentUser}_foods`, JSON.stringify(foods));
    }
  }, [currentUser, dailyGoal, foods]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddFood = (food: Omit<FoodEntry, "id" | "timestamp">) => {
    const newFood: FoodEntry = {
      ...food,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setFoods([newFood, ...foods]);
  };

  const handleDeleteFood = (id: string) => {
    setFoods(foods.filter((food) => food.id !== id));
  };

  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = foods.reduce((sum, food) => sum + food.fat, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Utensils className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Calorie Tracker
                </h1>
                <p className="text-muted-foreground">Welcome, {currentUser}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/weekly", { state: { foods } })}
                variant="outline"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Weekly Summary
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <CalorieProgress consumed={totalCalories} goal={dailyGoal} />
            <MacroProgress 
              protein={totalProtein} 
              carbs={totalCarbs} 
              fat={totalFat}
            />
            <GoalSetting currentGoal={dailyGoal} onUpdateGoal={setDailyGoal} />
            
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="search">
                  <Search className="mr-2 h-4 w-4" />
                  Quick Add
                </TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="mt-4">
                <AddFoodForm onAddFood={handleAddFood} />
              </TabsContent>
              <TabsContent value="search" className="mt-4">
                <FoodSearch onAddFood={handleAddFood} mealType={currentMealType} />
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant={currentMealType === "breakfast" ? "default" : "outline"}
                    onClick={() => setCurrentMealType("breakfast")}
                  >
                    Breakfast
                  </Button>
                  <Button
                    size="sm"
                    variant={currentMealType === "lunch" ? "default" : "outline"}
                    onClick={() => setCurrentMealType("lunch")}
                  >
                    Lunch
                  </Button>
                  <Button
                    size="sm"
                    variant={currentMealType === "dinner" ? "default" : "outline"}
                    onClick={() => setCurrentMealType("dinner")}
                  >
                    Dinner
                  </Button>
                  <Button
                    size="sm"
                    variant={currentMealType === "snack" ? "default" : "outline"}
                    onClick={() => setCurrentMealType("snack")}
                  >
                    Snack
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Today's Meals</h2>
            <FoodList foods={foods} onDeleteFood={handleDeleteFood} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
