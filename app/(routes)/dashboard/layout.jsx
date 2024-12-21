'use client'

import { db } from '@/utils/dbConfig'
import DashboardHeader from './_components/DashboardHeader'
import SideNav from './_components/SideNav'
import { Budgets } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { useEffect } from 'react'

function DashboardLayout({ children }) {

    const { user } = useUser();
    const router = useRouter();

    // useEffect(() => {
    //     user && checkUserBudgets();
    // }, [user])

    // const checkUserBudgets = async () => {
    //     const result = await db.select()
    //         .from(Budgets)
    //         .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
    //     console.log(result);
    //     if (result?.length == 0) {
    //         router.replace('/dashboard/budgets')
    //     }
    // }

    return (
        <div>
            <div className='fixed md:w-64 hidden md:block'>
                <SideNav />
            </div>
            <div className='md:ml-64'>
                <DashboardHeader />
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout