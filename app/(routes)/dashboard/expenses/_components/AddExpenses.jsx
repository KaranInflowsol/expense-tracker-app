import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import React, { useState } from "react";
import { toast } from "sonner";
import moment from "moment";
import { Loader } from "lucide-react";

function AddExpenses({ user, budgetId, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmout] = useState("");
  const [loading, setLoading] = useState("");

  const addNewExpense = async () => {
    setLoading(true);
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        createdAt: moment().format("DD/MM/yyyy"),
      })
      .returning({ insertedId: Budgets.id });

    setAmout("");
    setName("");

    if (result) {
      setLoading(false);
      refreshData();
      toast("New Expense Added!!");
    }

    setLoading(false)
  };

  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          value={name}
          placeholder="e.g. Bed Decoration"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          value={amount}
          placeholder="e.g. 5000"
          onChange={(e) => setAmout(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount) || loading}
        onClick={() => addNewExpense()}
        className="mt-3 w-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpenses;
