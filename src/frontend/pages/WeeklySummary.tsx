import { Card } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { ArrowLeft, TrendingUp, Calendar, Flame } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { FoodEntry } from "@/frontend/components/AddFoodForm";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const WeeklySummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const foods = (location.state?.foods || []) as FoodEntry[];

  // Group foods by day
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    return days;
  };

  const last7Days = getLast7Days();
  
  const dailyData = last7Days.map(day => {
    const dayFoods = foods.filter(food => {
      const foodDate = new Date(food.timestamp);
      foodDate.setHours(0, 0, 0, 0);
      return foodDate.getTime() === day.getTime();
    });

    const calories = dayFoods.reduce((sum, food) => sum + food.calories, 0);
    const protein = dayFoods.reduce((sum, food) => sum + food.protein, 0);
    const carbs = dayFoods.reduce((sum, food) => sum + food.carbs, 0);
    const fat = dayFoods.reduce((sum, food) => sum + food.fat, 0);

    return {
      date: day.toLocaleDateString('en-US', { weekday: 'short' }),
      calories,
      protein,
      carbs,
      fat,
    };
  });

  const totalCalories = dailyData.reduce((sum, day) => sum + day.calories, 0);
  const avgCalories = Math.round(totalCalories / 7);
  const totalProtein = dailyData.reduce((sum, day) => sum + day.protein, 0);
  const totalCarbs = dailyData.reduce((sum, day) => sum + day.carbs, 0);
  const totalFat = dailyData.reduce((sum, day) => sum + day.fat, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Today
          </Button>
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Weekly Summary</h1>
          </div>
          <p className="text-muted-foreground mt-2">Your nutrition over the last 7 days</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card className="p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Total Calories</h3>
            </div>
            <p className="text-3xl font-bold">{totalCalories}</p>
            <p className="text-sm text-muted-foreground mt-1">This week</p>
          </Card>

          <Card className="p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="font-semibold">Daily Average</h3>
            </div>
            <p className="text-3xl font-bold">{avgCalories}</p>
            <p className="text-sm text-muted-foreground mt-1">cal/day</p>
          </Card>

          <Card className="p-4 shadow-md">
            <h3 className="font-semibold mb-2">Total Protein</h3>
            <p className="text-3xl font-bold text-success">{totalProtein}g</p>
            <p className="text-sm text-muted-foreground mt-1">This week</p>
          </Card>

          <Card className="p-4 shadow-md">
            <h3 className="font-semibold mb-2">Carbs & Fat</h3>
            <p className="text-xl font-bold text-warning">{totalCarbs}g carbs</p>
            <p className="text-xl font-bold text-info">{totalFat}g fat</p>
          </Card>
        </div>

        <Card className="p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Daily Calories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Macronutrients Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="protein" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="carbs" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fat" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default WeeklySummary;
