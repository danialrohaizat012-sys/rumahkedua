import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const store = sqliteTable('pos_store', { id: text('id').primaryKey(), data: text('data').notNull(), revision: integer('revision').notNull().default(0) });
