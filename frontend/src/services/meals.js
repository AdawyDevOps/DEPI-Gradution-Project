import api from './api';

export const mealService = {
  // إضافة وجبة جديدة
  addMeal: (mealData) => {
    return api.post('/meals', mealData);
  },

  // الحصول على وجبات اليوم
  getTodayMeals: () => {
    return api.get('/meals/today');
  },

  // الحصول على إحصائيات أسبوعية
  getWeeklyStats: (startDate) => {
    return api.get(`/meals/weekly?startDate=${startDate}`);
  },

  // حذف وجبة
  deleteMeal: (mealId) => {
    return api.delete(`/meals/${mealId}`);
  }
};
