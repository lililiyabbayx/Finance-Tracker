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

export interface Transaction {
  id: string; // This is the field you use on the frontend
  _id?: string; // The backend sends _id, so make it optional
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
}

export interface RevenueExpenseData {
  _id: string;
  total: number;
}

export interface RevenueExpenseComparisonData {
  revenue: RevenueExpenseData[];
  expenses: RevenueExpenseData[];
}

export interface RevenueProfitData {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  totalRevenue: number;
}
export type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};
