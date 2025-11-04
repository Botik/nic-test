import { Task } from 'domain/entities/Task'
import type { TaskRepository as TaskRepositoryInterface } from 'domain/repositories/TaskRepository'
import { eq } from 'drizzle-orm'

import { db } from '../drizzle/'
import { tasksTable } from '../drizzle/schema'

export class TaskRepository implements TaskRepositoryInterface {
	save(task: Task): Promise<Task> {
		return db
			.insert(tasksTable)
			.values({
				id: task.id === 0 ? undefined : task.id,
				title: task.title,
				description: task.description ?? null,
				status: task.status,
				dueDate: task.dueDate,
			})
			.returning()
			.then(rows => this.mapToEntity(rows[0]))
	}

	findById(id: number): Promise<Task | null> {
		return db
			.select()
			.from(tasksTable)
			.where(eq(tasksTable.id, id))
			.then(rows => (rows.length ? this.mapToEntity(rows[0]) : null))
	}

	findAll(status?: 'pending' | 'completed'): Promise<Task[]> {
		const whereClause = status ? eq(tasksTable.status, status) : undefined

		return db
			.select()
			.from(tasksTable)
			.where(whereClause)
			.then(rows => rows.map(row => this.mapToEntity(row)))
	}

	delete(id: number): Promise<void> {
		return db
			.delete(tasksTable)
			.where(eq(tasksTable.id, id))
			.then(() => undefined)
	}

	private mapToEntity(row: typeof tasksTable.$inferSelect): Task {
		return new Task(
			row.id,
			row.title,
			row.description ?? null,
			row.status as 'pending' | 'completed',
			row.dueDate ?? null,
		)
	}
}
