"use client"
import React, { useState } from 'react';
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
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { db } from '@/utils/dbConfig';

function CreateBudget({refreshData}) {
    const [emojiIcon, setEmojiIcon] = useState('😊');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const { user } = useUser();

    const onCreateBudget = async () => {
        try {
            const result = await db.insert(Budgets)
                .values({
                    name: name,
                    amount: amount,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    icon: emojiIcon
                }).returning({ insertedId: Budgets.id });

            if (result) {
                refreshData();
                toast('Budget Created Successfully!!!');
            }
        } catch (error) {
            console.error('Error creating budget:', error);
            toast('Failed to create budget');
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
                        <h2>+</h2>
                        <h2>Create New Budget</h2>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Budget</DialogTitle>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Budget</DialogTitle>
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
                                            <h2 className="text-black font-medium my-1">Budget Name</h2>
                                            <Input
                                                placeholder="e.g Home Decoration"
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <h2 className="text-black font-medium my-1">Budget Amount</h2>
                                            <Input
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
                                            onClick={() => onCreateBudget()}
                                            className="mt-5 w-full"
                                        >
                                            Create Budget
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

export default CreateBudget;