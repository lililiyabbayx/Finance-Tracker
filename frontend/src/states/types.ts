export interface ExpensesByCategory {
  salaries: number;
  supplies: number;
  services: number;
}
export interface Month {
  id: string;
  month: string;
  revenue: number;
  expenses: number;
  operationalExpenses: number;
  nonOperationalExpenses: number;
}
export interface Day {
  id: string;
  date: string;
  revenue: number;
  expenses: number;
}
export interface GetKpisResponse {
  _id: string;
  __v: number;
  userId: string;
  totalProfit: number;

  totalRevenue: number;
  totalExpense: number;
  monthlyData: Array<Month>;
  expenseByCategory: ExpensesByCategory;
  dailyData: Array<Day>;
}
