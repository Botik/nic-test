import { Task } from 'domain/entities/Task'

export type TaskResponseDto = {
	id: number
	title: string
	description: string | null
	status: 'pending' | 'completed'
	dueDate: string | null // ISO 8601 строка для JSON
}

export namespace TaskResponseDto {
	export function fromEntity(task: Task): TaskResponseDto {
		return {
			id: task.id,
			title: task.title,
			description: task.description,
			status: task.status,
			dueDate: task.dueDate ? task.dueDate.toISOString() : null,
		}
	}
}
