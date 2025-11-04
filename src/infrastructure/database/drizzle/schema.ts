import { taskStatusEnum } from 'domain/entities/Task'
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const tasksTable = pgTable('todos', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	status: text('status', { enum: taskStatusEnum }).notNull().default('pending'),
	dueDate: timestamp('due_date', { mode: 'date' }),
})
