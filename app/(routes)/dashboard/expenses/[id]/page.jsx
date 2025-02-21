"use client";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpenses from "../_components/AddExpenses";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { PenBox, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import EditExpenses from "../_components/EditExpenses";

function ExpensesScreen() {
  const { user } = useUser();
  const params = useParams();
  const route = useRouter();

  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState();
  

  useEffect(() => {
    user && getBudgetInfo();
  }, [user, params?.id]);

  const getBudgetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budgets.id, params?.id))
      .groupBy(Budgets.id);

    setBudgetInfo(result[0] || {});
    getExpensesList();
  };

  const getExpensesList = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
    console.log(result);
  };

  const deleteBudget = async () => {
    const deleteExpensesResult = await db
      .delete(Expenses)
      .where(eq(Expenses.id, params.id))
      .returning();

    if (deleteExpensesResult) {
      const result = await db
        .delete(Budgets)
        .where(eq(Budgets.id, params.id))
        .returning();
    }
    toast("Budget Deleted!")
    route.replace('/dashboard/budgets')
  };



  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold  flex justify-between items-center">
        My Expenses
        <div className="flex gap-2 items-center">
          <EditExpenses budgetInfo={budgetInfo} refreshData={()=>getBudgetInfo()}/>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex gap-2" variant="destructive">
              <Trash /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                budget and expenses and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteBudget()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className="h-[150px] w-full bg-state-200 rounded-lg animate-pulse"></div>
        )}
        <AddExpenses
          user={user}
          budgetId={params.id}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div>
        <h2 className="font-bold text-lg">Letest Expenses</h2>
        <ExpenseListTable
          expensesList={expensesList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
