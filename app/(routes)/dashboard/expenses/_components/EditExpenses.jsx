"use client"
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function EditExpenses({budgetInfo, refreshData}) {
  const [emojiIcon, setEmojiIcon] = useState();
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const { user } = useUser();

  useEffect(()=>{
    if(budgetInfo) {
      setEmojiIcon(budgetInfo?.icon),
      setName(budgetInfo?.name),
      setAmount(budgetInfo?.amount)
    }
  },[budgetInfo])

  const onUpdateBudget = async() =>{
        const result = await db.update(Budgets).set({
            name:name,
            amount:amount,
            icon:emojiIcon
        }).where(eq(Budgets.id,budgetInfo.id))
        .returning();

        if(result) {
            refreshData();
            toast('Budget Updated!')
        }

        console.log(result);
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex gap-2">
            <PenBox />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Budget</DialogTitle>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Budget</DialogTitle>
                <div className="text-sm text-muted-foreground">
                  <div className="mt-5">
                    <Button
                      className="text-lg"
                      variant="outline"
                      onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                    >
                      {emojiIcon}
                    </Button>
                    {openEmojiPicker && (
                      <div className="absolute">
                        <EmojiPicker
                          onEmojiClick={(e) => {
                            setEmojiIcon(e.emoji);
                            setOpenEmojiPicker(false);
                          }}
                        />
                      </div>
                    )}
                    <div className="mt-2">
                      <h2 className="text-black font-medium my-1">
                        Budget Name
                      </h2>
                      <Input
                        defaultValue = {budgetInfo?.name}
                        placeholder="e.g Home Decoration"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mt-2">
                      <h2 className="text-black font-medium my-1">
                        Budget Amount
                      </h2>
                      <Input
                        defaultValue = {budgetInfo?.amount}
                        type="number"
                        placeholder="e.g 5000₹"
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    disabled={!(name && amount)}
                    onClick={() => onUpdateBudget()}
                    className="mt-5 w-full"
                  >
                    Update Budget
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditExpenses;
