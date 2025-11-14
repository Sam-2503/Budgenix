import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext(undefined);

export const ExpenseProvider = ({ children }) => {
  const { user, isUserLoggedIn } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [expenseError, setExpenseError] = useState(null);

  // Fetch expenses when user logs in
  useEffect(() => {
    if (user && isUserLoggedIn) {
      fetchExpenses();
    } else {
      setExpenses([]);
    }
  }, [user, isUserLoggedIn]);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      setIsLoadingExpenses(true);
      setExpenseError(null);
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(
        "http://localhost:3300/api/expenses/get-expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setExpenses(response.data.expenses || []);
      return response.data.expenses || [];
    } catch (err) {
      console.error("Fetch expenses failed:", err);
      setExpenseError(err.response?.data?.message || err.message);
      setExpenses([]);
      return [];
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  // Add new expense
  const addExpense = async (expenseData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:3300/api/expenses/create",
        expenseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh expenses after adding
      await fetchExpenses();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Add expense failed:", err);
      throw err;
    }
  };

  // Delete expense
  const deleteExpense = async (expenseId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `http://localhost:3300/api/expenses/delete/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh expenses after deleting
      await fetchExpenses();
      return { success: true };
    } catch (err) {
      console.error("Delete expense failed:", err);
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    }
  };

  // Calculate total spent (only expenses, not income)
  const getTotalSpent = () => {
    return expenses
      .filter((expense) => expense.type === "expense")
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);
  };

  // Calculate total income from transactions (only income type)
  const getTotalIncome = () => {
    return expenses
      .filter((expense) => expense.type === "income")
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);
  };

  // Get expenses by category
  const getExpensesByCategory = (category) => {
    return expenses.filter(
      (expense) =>
        expense.type === "expense" &&
        expense.category?.toLowerCase() === category.toLowerCase()
    );
  };

  // Calculate spending by category (only expenses, not income)
  const getCategoryTotals = () => {
    const totals = {};
    expenses
      .filter((expense) => expense.type === "expense")
      .forEach((expense) => {
        const category = expense.category || "Uncategorized";
        totals[category] = (totals[category] || 0) + (expense.amount || 0);
      });
    return totals;
  };

  const value = {
    expenses,
    isLoadingExpenses,
    expenseError,
    fetchExpenses,
    addExpense,
    deleteExpense,
    getTotalSpent,
    getTotalIncome,
    getExpensesByCategory,
    getCategoryTotals,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

// Custom hook to use expense context
export const useExpense = () => {
  const context = useContext(ExpenseContext);

  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }

  return context;
};

export default ExpenseContext;
