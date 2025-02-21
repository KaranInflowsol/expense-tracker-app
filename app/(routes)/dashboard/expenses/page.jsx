'use client'
import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { db } from '@/utils/dbConfig';
import { desc, eq } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';

function ExpensesDisplay() {
  const [expensesList, setExpensesList] = useState([]);
  const { user } = useUser();

  const getAllExpenses = async () => {
    if (!user) return; // Ensure user is loaded

    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]); // Run when the user object is available

  return (
    <div className='p-4'>
      <ExpenseListTable expensesList={expensesList} refreshData={getAllExpenses} />
    </div>
  );
}

export default ExpensesDisplay;
