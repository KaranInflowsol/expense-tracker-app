import { pgTable, varchar, serial, numeric } from "drizzle-orm/pg-core";

export const Budgets = pgTable('budgets', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: numeric('amount').notNull(), // Use numeric for amounts
    icon: varchar('icon'),
    createdBy: varchar('createdBy').notNull(),
});